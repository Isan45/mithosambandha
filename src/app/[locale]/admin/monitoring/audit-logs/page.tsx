
import { getAuditLogs } from '@/lib/server-actions/monitoring';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';

export default async function AuditLogsPage() {
  const logs = await getAuditLogs(50);

  const getBadgeVariant = (action: string) => {
    if (action.includes('VERIFICATION_APPROVE')) return 'default';
    if (action.includes('VERIFICATION_REJECT')) return 'destructive';
    if (action.includes('USER_SUSPEND')) return 'destructive';
    if (action.includes('USER_UNSUSPEND')) return 'outline';
    return 'secondary';
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Audit Logs</h1>
        <Link href="/admin/monitoring" className="text-sm text-primary hover:underline">
          &larr; Back to Monitoring
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Administrative Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target User</TableHead>
                <TableHead>Reason/Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.adminUid.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(log.action) as any}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/users/${log.targetUid}`} className="text-primary hover:underline">
                      {log.targetUid.substring(0, 8)}...
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-xs overflow-hidden text-ellipsis text-sm">
                    {log.reason || (log.changes ? JSON.stringify(log.changes) : '-')}
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
