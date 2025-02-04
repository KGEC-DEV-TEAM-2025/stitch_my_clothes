"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { useAtom, useStore } from "jotai";
import { accountMenuState } from "@/app/utils/data/store";
import { useEffect, useState } from "react";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

// Define type for form data to improve type safety
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  password: string;
  country: string;
  zipCode: string;
}

const AccountPopUp = () => {
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useAtom(accountMenuState, {
    store: useStore(),
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSignup, setIsSignup] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasShownPopup, setHasShownPopup] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    password: "",
    country: "",
    zipCode: "",
  });

  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();

  const { isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const popupShown = localStorage.getItem('popupShown');
    if (popupShown) {
      setHasShownPopup(true);
      return;
    }

    if (!isSignedIn) {
      const timeoutId = setTimeout(() => {
        setAccountMenuOpen(true);
        localStorage.setItem("popupShown", "true");
        setHasShownPopup(true);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [setAccountMenuOpen, isSignedIn]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupSubmit = async () => {
    if (!isSignUpLoaded) return;

    try {

      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        unsafeMetadata: {
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          country: formData.country,
          zipCode: formData.zipCode
        }
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
      setShowVerificationDialog(true);
      setAccountMenuOpen(false);

    } catch (err: any) {
      toast.error("Error during sign up: " + err.message);
    }
  };

  const handleLoginSubmit = async () => {
    if (!isSignInLoaded) return;

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        setAccountMenuOpen(false);
        toast.success("Successfully signed in!");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("Error during sign in: " + err.message);
    }
  };

  const handleVerification = async () => {
    if (!isSignUpLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setShowVerificationDialog(false);

        // Additional user metadata can be added via your backend webhook
        toast.success("Email verified successfully!");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("Error during verification: " + err.message);
    }
  };

  const handleOnClickAccountMenu = () => {
    if (isLoaded && isSignedIn) {
      setLogoutDialogOpen(true);
    } else {
      setAccountMenuOpen(true);
    }
  };



  return (
    <div>
      {/* <Dialog open={accountMenuOpen} onOpenChange={setAccountMenuOpen}>
        <DialogTrigger asChild>
          <div className="relative"> */}
            <button
              onClick={handleOnClickAccountMenu}
              className="lg:flex relative"
            >
              {isSignedIn ? "Account" : "Login"}
            </button>
          {/* </div>
        </DialogTrigger>
      </Dialog> */}

      {/* Updated Logout Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogTitle>Log Out</DialogTitle>
          <Card>
            <CardHeader className="px-6 py-4">
              <h3 className="text-lg font-medium">Log Out</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to log out?
              </p>
            </CardHeader>
            <CardFooter className="flex justify-end gap-3 px-6 py-4">
              <Button variant="default" className="w-24" onClick={() => setLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="w-24"
                onClick={() => {
                  setLogoutDialogOpen(false);
                  signOut();
                }}
              >
                Log Out
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog open={accountMenuOpen} onOpenChange={setAccountMenuOpen}>
        <DialogContent className="sm:max-w-[725px] flex">
          <Card className="space-y-3">
            <Tabs defaultValue="signup">
              <TabsList className="grid w-full grid-cols-2">

                <TabsTrigger value="signup" className="font-bold data-[state=active]:bg-[#c40600] data-[state=active]:text-white" onClick={() => setIsSignup(true)}>
                  Discount-Sign Up
                </TabsTrigger>
                <TabsTrigger value="login" className="font-bold data-[state=active]:bg-[#c40600] data-[state=active]:text-white" onClick={() => setIsSignup(false)}>sign in</TabsTrigger>

              </TabsList>
              <TabsContent value="login">
                <CardHeader>
                  <CardTitle className="font-bold">Sign In</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login" className="font-bold">Email</Label>
                    <Input
                      id="email-login"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login" className="font-bold">Password</Label>
                    <Input
                      id="password-login"
                      name="password"
                      type="password"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-[#c40600]"
                    onClick={handleLoginSubmit}
                  >
                    Sign In
                  </Button>
                </CardFooter>
              </TabsContent>
              <TabsContent value="signup">
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>
                    Create a new account to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-bold">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-bold">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="font-bold">Email</Label>
                    <Input
                      id="email-signup"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="font-bold">Password</Label>
                    <Input
                      id="password-signup"
                      name="password"
                      type="password"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-bold">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1234567890"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="font-bold">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      placeholder="+1234567890"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="font-bold">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        placeholder="India"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="font-bold">Zip Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-[#c40600]"
                    onClick={handleSignupSubmit}
                  >
                    Sign Up
                  </Button>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
          <div className="space-y-10 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-2 pt-4 px-2">
              <h1 className="sm:text-4xl text-2xl font-bold text-[#646464]">GET 25% OFF</h1>
              <p className="text-md font-semibold text-center">shop at stich my clothes and get discounts.</p>
            </div>
            <Image src={'/archive/stylish-groom-getting-ready-in-morning-putting-on-2021-08-29-11-41-08-utc.JPG'} alt="login" className="object-cover" width={400} height={100} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <Card>
            <CardHeader>
              <CardTitle>Email Verification</CardTitle>
              <CardDescription>
                Enter the verification code sent to your email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code" className="font-bold">
                  Verification Code
                </Label>
                <Input
                  id="verification-code"
                  name="verification-code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-[#c40600]"
                onClick={handleVerification}
              >
                Verify Email
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default AccountPopUp;