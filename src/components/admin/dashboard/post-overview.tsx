import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./stats-card";
import { Edit, Eye, FileText, TrendingUp } from "lucide-react";
import { PostStat } from "@/types";

export default function PostOverview({postStat}: {postStat: PostStat}) {
    return (
    <Card>
        <CardHeader>
            <CardTitle>Post Overview</CardTitle>
        </CardHeader>
        <CardContent>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <StatsCard
                title='Total Posts'
                value={postStat.totalPost}
                icon={FileText}
                trend={{ value: 8, isPositive: true }}
                color='default'
            />
            <StatsCard
                title='Published'
                value={postStat.publishedPost}
                icon={Eye}
                trend={{ value: 12, isPositive: true }}
                color='success'
            />
            <StatsCard title='Drafts' value={postStat.draftPost} icon={Edit} color='warning' />
            <StatsCard
                title='Total Views'
                value={postStat.totalViews}
                icon={TrendingUp}
                trend={{ value: 23, isPositive: true }}
                color='default'
                />
            </div>
        </CardContent>
    </Card>
    );
}