import { useEffect, useState } from "react";
import { API_PATHS } from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import { Trash, Check, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger, } from "@/components/ui/accordion";
import { useGetUsers } from "@/hooks/useGetUsers";

export default function AdminUsers() {
  const { users, getUsers } = useGetUsers()
  useEffect(() => {
    getUsers();
  }, []);
  const nullUsers = users.filter((u) => u.isActive === null);
  const falseUsers = users.filter((u) => u.isActive === false);
  const trueUsers = users.filter((u) => u.isActive === true);


  const Approact = async (id: string) => {
    axiosInstance.put(API_PATHS.giveApproach(id))
    getUsers()
  }
  const RejectUser = async (id: string) => {
    await axiosInstance.put(API_PATHS.giveReject(id));
    getUsers();
  };
  const DeleteUser = async (id: string) => {
    await axiosInstance.delete(API_PATHS.deleteUser(id));
    getUsers();
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Kullanıcı Yönetimi</h2>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="null-users">
          <AccordionTrigger>Onay Bekleyen Kullanıcılar (isActive = null)</AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actions</TableHead>
                  <TableHead>First</TableHead>
                  <TableHead>Last</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>


              <TableBody>
                {nullUsers.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="flex justify-center gap-3">
                      <button onClick={() => { Approact(String(u._id)) }}>
                        <Check size={18} className="text-green-600" />
                      </button>
                      <button onClick={() => RejectUser(String(u._id))}>
                        <X size={18} className="text-red-600" />
                      </button>
                    </TableCell>


                    <TableCell>{u.firstName}</TableCell>
                    <TableCell>{u.lastName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phoneNumber}</TableCell>
                    <TableCell>{u.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="false-users">
          <AccordionTrigger>Aktif Olmayan Kullanıcılar (isActive = false)</AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actions</TableHead>
                  <TableHead>First</TableHead>
                  <TableHead>Last</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>


              <TableBody>
                {falseUsers.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="flex justify-center gap-3">
                      <button onClick={() => Approact(String(u._id))}>
                        <Check size={18} className="text-green-600" />
                      </button>

                      <button onClick={() => DeleteUser(String(u._id))}>
                        <Trash size={18} className="text-red-600" />
                      </button> 
                    </TableCell>


                    <TableCell>{u.firstName}</TableCell>
                    <TableCell>{u.lastName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phoneNumber}</TableCell>
                    <TableCell>{u.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>

         <AccordionItem value="true-users">
          <AccordionTrigger>Aktif  Kullanıcılar (isActive = true)</AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actions</TableHead>
                  <TableHead>First</TableHead>
                  <TableHead>Last</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>


              <TableBody>
                {trueUsers.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="flex justify-center gap-3">
                       <button onClick={() => DeleteUser(String(u._id))}>
                        <Trash size={18} className="text-red-600" />
                      </button> 
                    </TableCell>


                    <TableCell>{u.firstName}</TableCell>
                    <TableCell>{u.lastName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phoneNumber}</TableCell>
                    <TableCell>{u.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
