import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./stats-card";
import { Users,
UserPlus,
UserMinus } from "lucide-react";
import { SubscriberStat } from "@/types";

export default function SubscriberOverview({subscriberStat} : {subscriberStat: SubscriberStat}) {
    return (
    <Card>
        <CardHeader>
            <CardTitle>Subscriber Overview</CardTitle>
        </CardHeader>
        <CardContent>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            <StatsCard
                title='Total'
                value={subscriberStat.activeSubscribers}
                icon={Users}
                color='default'
            />
            {/* <div className="grid grid-cols-1 gap-6">  */}
                <StatsCard
                    title='New'
                    value={subscriberStat.newSubscribers}
                    icon={UserPlus}
                    color='success'
                />
                <StatsCard title='Unsubs' value={subscriberStat.unsubscribed} icon={UserMinus} color='danger' />
            {/* </div> */}
            
            </div>
        </CardContent>
    </Card>
    );
}