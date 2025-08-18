import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Subscriber } from '@/types';


export function RecentSubs({subscribers}: {subscribers: Subscriber[]}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Subscriber</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent subscribers.</TableCaption>
          <TableHeader>
            <TableRow >
              <TableHead className="w-[120px] font-semibold">Name</TableHead>
              <TableHead className='font-semibold'>Email</TableHead>
              <TableHead className='font-semibold'>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.subscription_id}>
                <TableCell className="font-medium">{subscriber.subscription_name}</TableCell>
                <TableCell>{subscriber.subscription_email}</TableCell>
                <TableCell>{subscriber.subscription_created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
