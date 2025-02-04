'use client';
import Image from 'next/image';
import Link from 'next/link';
import { products } from './data';

interface Product {
    image: string;
    productId: string | number;
    fabric: string;
    price: number;
    color?: string;
}

const Page = () => {
    return (
        <div className="min-h-screen pt-28">
            <div className="container mx-auto p-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <h2 className="text-4xl font-semibold mb-4 text-[#646464]">Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product: Product) => (
                            <div key={product.productId} className="w-full rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 overflow-hidden relative">
                                <Link href={'/form'} className="block">
                                    <Image
                                        src={product.image}
                                        alt={product.fabric}
                                        width={500}
                                        height={500}
                                        className="rounded-t-lg object-cover w-full h-[250px]"
                                        priority
                                    />
                                </Link>
                                <div className="p-2 rounded-b-lg flex flex-col">
                                    <p className="text-center font-medium">{product.fabric}</p>
                                    <p className="text-center">${product.price}</p>
                                    <div className="flex justify-center mt-2 space-x-2"> 
                                        <div className="rounded-full w-8 h-8 shadow-md bg-gray-300"></div> 
                                        {product.color && (
                                            <div
                                                className="rounded-full w-8 h-8 shadow-md"
                                                style={{ backgroundColor: product.color }}
                                            ></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;