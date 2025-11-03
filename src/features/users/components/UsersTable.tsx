import Table from "@/src/shared/ui/Table";
import Button from "@/src/shared/ui/Button";
import { CustomSelect } from "@/src/shared/ui/CustomSelect";
import type { User, UsersTableProps } from "../types";

// Component to display a table of users with actions
export const UsersTable = ({
  users,
  searchTerm,
  filterRole,
  filterStatus,
  onRoleChange,
  onBanUser,
  onUnbanUser,
  onDeleteUser,
}: UsersTableProps) => {
  return (
    <>
      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
          { key: "banReason", label: "Ban Reason" },
          { key: "joined", label: "Joined" },
          { key: "actions", label: "Actions" },
        ]}
        data={users}
        emptyMessage={
          searchTerm || filterRole || filterStatus
            ? "No users found matching your filters"
            : "No users yet"
        }
        renderRow={(user: User) => (
          <>
            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
              {user.name}
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
              {user.email}
            </td>
            <td className="px-4 py-3">
              <div
                className={user.role === "admin" ? "role-admin" : "role-user"}
              >
                <CustomSelect
                  value={user.role}
                  onChange={(value) =>
                    onRoleChange(user.id, value as "user" | "admin")
                  }
                  options={[
                    { value: "user", label: "User" },
                    { value: "admin", label: "Admin" },
                  ]}
                  size="sm"
                  className={`${
                    user.role === "admin"
                      ? "[&>button]:bg-amber-100 dark:[&>button]:bg-amber-900/20 [&>button]:border-amber-400 dark:[&>button]:border-amber-800 [&>button]:text-amber-700 dark:[&>button]:text-amber-400 [&>button:hover]:border-amber-600"
                      : "[&>button]:bg-gray-100 [&>button]:dark:bg-zinc-900 [&>button]:border-gray-300 [&>button]:dark:border-zinc-700 [&>button]:text-gray-700 [&>button]:dark:text-gray-400"
                  }`}
                />
              </div>
            </td>
            <td className="px-4 py-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  user.status === "active"
                    ? "bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400"
                }`}
              >
                {user.status}
              </span>
            </td>
            <td className="px-4 py-3">
              {user.status === "banned" ? (
                <div className="flex flex-col gap-1">
                  {user.bannedReason && (
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user.bannedReason}
                    </span>
                  )}
                  {user.bannedUntil && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Until: {new Date(user.bannedUntil).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-gray-400 dark:text-gray-600">-</span>
              )}
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2 flex-wrap">
                {user.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => onBanUser(user)}
                    className="px-3 py-1.5 text-sm bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 font-semibold rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/40 hover:border-yellow-500 dark:hover:border-yellow-700 transition-all"
                  >
                    Ban
                  </button>
                ) : (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onUnbanUser(user.id, user.name)}
                  >
                    Unban
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDeleteUser(user.id, user.name)}
                >
                  Delete
                </Button>
              </div>
            </td>
          </>
        )}
      />
    </>
  );
};
