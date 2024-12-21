import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "../components/dashboard/EmptyState";
import prisma from "../utils/db";
import { requireUser } from "../utils/requireUser";
import Image from "next/image";
import Defaultimage from "@/public/default.png"
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getData(userId: string) {
    const [sites, articles] = await Promise.all([
        await prisma.site.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 3,
        }),
        await prisma.post.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 3,
        }),
    ]);

    return { sites, articles };
}
export default async function DashboardIndexPage() {
    const user = await requireUser();
    const data = await getData(user.id);

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-5 ">Your Sites</h1>
            {data.sites.length === 0 ? (
                <EmptyState
                    title="You dont have any Sites created"
                    description="You currently dont have any Sites. Please create one to get started."
                    href="/dashboard/sites/new"
                    buttonText="Create Site" />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                    {data.sites.map((item) => (
                        <Card key={item.id}>
                            <Image src={item.imageUrl ?? Defaultimage} alt={item.name} className="rounded-t-log object-cover w-full h-[200px]" width={400} height={200} />
                            <CardHeader>
                                <CardTitle className="truncate">{item.name}</CardTitle>
                                <CardDescription className="line-clamp-3">{item.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-between">
                                <Button asChild className="w-fit">
                                    <Link href={`/dashboard/sites/${item.id}`}>View Articles</Link>
                                </Button>
                                <Button asChild className="w-fit" variant={"outline"}>
                                    <Link href={`/dashboard/sites/${item.id}/settings`}>Settings</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            <h1 className="text-2xl font-semibold mt-10 mb-5 ">Recent Articles</h1>
            {data.articles.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                    {data.articles.map((item) => (
                        <Card key={item.id}>
                            <Image src={item.image ?? Defaultimage} alt={item.title} className="rounded-t-log object-cover w-full h-[200px]" width={400} height={200} />
                            <CardHeader>
                                <CardTitle className="truncate">{item.title}</CardTitle>
                                <CardDescription className="line-clamp-3">{item.smallDescription}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/dashboard/sites/${item.siteId}/${item.id}`}>Edit Article</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="You dont have any Articles created"
                    description="You currently dont have any Articles. Please create one to get started."
                    href="/dashboard/sites/"
                    buttonText="Create Article" />

            )
            }
        </div>
    )
};