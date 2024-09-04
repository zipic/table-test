import { ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchUsers,
  selectError,
  selectFilter,
  selectLoading,
  selectUsers,
  setFilterType,
} from "../../redux/userSlice";
import { useAppSelector } from "../../redux/hooks";
import { AppDispatch } from "../../redux/store";
import "./style.scss";

type FilterKey = "name" | "username" | "email" | "phone";

export const UsersTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useAppSelector(selectUsers);
  const filters = useAppSelector(selectFilter);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filterKeys: FilterKey[] = ["name", "username", "email", "phone"];

  const filteredUsers = users.filter((user) =>
    filterKeys.every((key) => {
      const filterValue = filters[key];
      const userValue = user[key];

      return (
        typeof userValue === "string" &&
        userValue.toLowerCase().includes(filterValue.toLowerCase())
      );
    })
  );

  const handleFilterChange = (field: FilterKey, value: string) => {
    dispatch(setFilterType({ field, value }));
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Users</h2>
      {loading && <span className="loader"></span>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <table className="user-table">
          <thead className="table-head">
            <tr className="table-row">
              {filterKeys.map((column) => (
                <th className="table-column-header" key={column}>
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                  <input
                    className="table-filter-input"
                    type="text"
                    value={filters[column] || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFilterChange(column, e.target.value)
                    }
                    placeholder={`Search ${column}`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredUsers.map((user) => (
              <tr className="table-body-row" key={user.id}>
                <td className="table-cell">{user.name}</td>
                <td className="table-cell">{user.username}</td>
                <td className="table-cell">{user.email}</td>
                <td className="table-cell">{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersTable;
