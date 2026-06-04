import { ContactHeader } from "@/components/dashboard/contact/ContactHeader"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getContact } from "@/server/admin/actions/contact"

export default async function Contact() {
    const contact = await getContact()

    return (
        <div className="space-y-6">
            <ContactHeader />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-37.5">Name</TableHead>
                        <TableHead className="w-50">Email</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="w-37.5 text-right">Received</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contact.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                No submissions yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        contact.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell className="font-medium">{entry.name}</TableCell>
                                <TableCell>{entry.email}</TableCell>
                                <TableCell className="whitespace-normal">{entry.message}</TableCell>
                                <TableCell className="text-right">{entry.createdAt.toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
