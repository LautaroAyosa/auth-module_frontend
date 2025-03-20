// pages/dashboard/admin/users.tsx

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faUserCog,
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

// Example user structure
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Example roles
const ALL_ROLES = ["admin", "user", "manager"];

// Mock Data
const MOCK_USERS: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "manager" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "manager" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "manager" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "manager" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "manager" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "manager" },
  /* Add more if you like */
];

function ManageUsersPage() {
  // Full user list data
  const [allUsers, setAllUsers] = useState<User[]>([]);
  // Visible subset (after filtering, sorting, pagination)
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);

  // Search / filter / sorting / pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  // Keep track of the column being sorted, and direction (asc or desc)
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch users on mount (replace with real fetching logic)
  useEffect(() => {
    // Suppose we fetch from an API
    // fetch("/api/users") ...
    // For now, load mock data
    setAllUsers(MOCK_USERS);
  }, []);

  // Whenever search/filter/sort/pagination changes OR allUsers changes,
  // re-compute displayedUsers.
  useEffect(() => {
    let filtered = [...allUsers];

    // Filter by search
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower)
      );
    }

    // Filter by role
    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // Sort
    if (sortColumn) {
      filtered.sort((a, b) => {
        const valA = a[sortColumn] ?? "";
        const valB = b[sortColumn] ?? "";
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    setDisplayedUsers(paginated);
  }, [
    allUsers,
    searchQuery,
    roleFilter,
    sortColumn,
    sortDirection,
    currentPage,
    itemsPerPage,
  ]);

  // When filters change, reset page to 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, itemsPerPage]);

  // Handler: change sort or flip direction
  const handleSort = (col: keyof User) => {
    if (sortColumn === col) {
      // Already sorted by this column => flip direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Different column => sort ascending
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  // Handler: go to next/prev page
  const nextPage = () => {
    setCurrentPage((p) => p + 1);
  };
  const prevPage = () => {
    setCurrentPage((p) => (p > 1 ? p - 1 : 1));
  };

  // Placeholder action handlers
  const handleDeleteUser = (userId: number) => {
    // TODO: implement real logic
    console.log("Deleting user with ID:", userId);
  };
  const handleChangeUserRole = (userId: number) => {
    // TODO: implement real logic
    console.log("Changing role for user:", userId);
  };
  const handleEditUser = (userId: number) => {
    // TODO: implement real logic
    console.log("Editing user with ID:", userId);
  };

  // Calculate total pages
  const totalItems = (() => {
    // re-run the same filtering logic used above, except pagination
    let filtered = [...allUsers];
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower)
      );
    }
    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    return filtered.length;
  })();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-6">
      <header className="bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-gray-600">Add, remove, or update user accounts.</p>
      </header>

      <section className="bg-white p-4 rounded shadow space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Search Bar */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by name or email
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded w-full p-2"
              placeholder="Search..."
            />
          </div>

          {/* Filter by Role */}
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border rounded w-full p-2"
            >
              <option value="">All Roles</option>
              {ALL_ROLES.map((r) => (
                <option value={r} key={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Items per page */}
          <div className="w-44">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Items per page
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border rounded w-full p-2"
            >
              {[5, 10, 25, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="border-b bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => handleSort("name")}
                  >
                    <span>Name</span>
                    {sortColumn === "name" ? (
                      sortDirection === "asc" ? (
                        <FontAwesomeIcon icon={faSortUp} />
                      ) : (
                        <FontAwesomeIcon icon={faSortDown} />
                      )
                    ) : (
                      <FontAwesomeIcon icon={faSort} />
                    )}
                  </button>
                </th>
                <th className="py-2 px-4 text-left">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => handleSort("email")}
                  >
                    <span>Email</span>
                    {sortColumn === "email" ? (
                      sortDirection === "asc" ? (
                        <FontAwesomeIcon icon={faSortUp} />
                      ) : (
                        <FontAwesomeIcon icon={faSortDown} />
                      )
                    ) : (
                      <FontAwesomeIcon icon={faSort} />
                    )}
                  </button>
                </th>
                <th className="py-2 px-4 text-left">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => handleSort("role")}
                  >
                    <span>Role</span>
                    {sortColumn === "role" ? (
                      sortDirection === "asc" ? (
                        <FontAwesomeIcon icon={faSortUp} />
                      ) : (
                        <FontAwesomeIcon icon={faSortDown} />
                      )
                    ) : (
                      <FontAwesomeIcon icon={faSort} />
                    )}
                  </button>
                </th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{u.role}</td>
                  <td className="py-2 px-4 space-x-2">
                    {/* Delete user */}
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete user"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    {/* Change role */}
                    <button
                      onClick={() => handleChangeUserRole(u.id)}
                      className="text-gray-600 hover:text-gray-800"
                      title="Change role"
                    >
                      <FontAwesomeIcon icon={faUserCog} />
                    </button>
                    {/* Edit user */}
                    <button
                      onClick={() => handleEditUser(u.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit user"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                </tr>
              ))}

              {displayedUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          <div>
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages || 1}</span>
          </div>
          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage >= totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}


ManageUsersPage.getLayout = (page:React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>

export default ManageUsersPage