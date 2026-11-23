
import {
  Users,
  Search,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { User } from "@/lib/types/user"
import RoleChangeButton from "./_components/role-change-button"
import { getUsers } from "@/lib/api/user"

const UsersPage = async () => {
  const usersData = await getUsers()
  const users = usersData.users ?? []

  const totalUsers = users.length
  const totalCustomers = users.filter(
    (user: User) => user.role === "customer"
  ).length

  const totalTechnicians = users.filter(
    (user: User) => user.role === "technician"
  ).length

  return (
    <div className="min-h-screen min-w-0 bg-[#F5F7FA] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl min-w-0 space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#102A43]">
              Manage Users
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View and manage all registered users on RepairLagbe.
            </p>
          </div>

          <Button className="bg-[#167D9A] hover:bg-[#126780]">
            <Users className="mr-2 size-4" />
            Manage Users
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-blue-50 p-3 text-[#167D9A]">
                <Users className="size-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Users</p>
                <h2 className="text-2xl font-bold text-[#102A43]">
                  {totalUsers}
                </h2>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-teal-50 p-3 text-[#167D9A]">
                <Users className="size-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Customers</p>
                <h2 className="text-2xl font-bold text-[#102A43]">
                  {totalCustomers}
                </h2>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm sm:col-span-2 lg:col-span-1">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Technicians</p>
                <h2 className="text-2xl font-bold text-[#102A43]">
                  {totalTechnicians}
                </h2>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="min-w-0 border-slate-200 shadow-sm">
          <CardHeader className="space-y-4">
            <div>
              <CardTitle className="text-lg text-[#102A43]">
                All Users
              </CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                Manage user information and account roles.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-9"
                />
              </div>

              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="size-4" />
                Filter Role
              </Button>
            </div>
          </CardHeader>

          <CardContent className="min-w-0 p-0">
            <div className="w-full min-w-0 overflow-x-auto">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="w-[25%] pl-6">User</TableHead>
                    <TableHead className="w-[25%]">Email</TableHead>
                    <TableHead className="w-[15%]">Role</TableHead>
                    <TableHead className="w-[15%]">Joined Date</TableHead>
                    <TableHead className="w-[20%] pr-6 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.length > 0 ? (
                    users.map((user: User) => (
                      <TableRow key={user._id}>
                        <TableCell className="min-w-0 pl-6">
                          <div className="flex min-w-0 items-center gap-3">
                            <img
                              src={user.image || "/default-avatar.png"}
                              alt={user.name}
                              className="size-10 shrink-0 rounded-full object-cover"
                            />
                            <span className="truncate font-medium text-[#102A43]">
                              {user.name}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="truncate">
                          {user.email}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">
                            {user.role ?? "customer"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-sm">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-GB"
                              )
                            : "—"}
                        </TableCell>

                        <TableCell className="pr-6 text-right">
                          <div className="flex justify-end">
                            <RoleChangeButton
                              userId={user._id}
                              currentRole={
                                (user.role ?? "customer") as
                                  | "customer"
                                  | "technician"
                                  | "admin"
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-40 text-center text-slate-500"
                      >
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UsersPage
