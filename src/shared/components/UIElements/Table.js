import React, { useContext, useState, useEffect } from "react";

import { AuthContext } from "../../context/auth-context";
import IconOnlyButton from "./IconOnlyButton";

import "./Table.css";

const Table = ({ data: initialData, loading: initialLoading, onRowClick, columns, actions }) => {
    const auth = useContext(AuthContext);

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(initialLoading);

    useEffect(() => {
        setData(initialData);
        setLoading(initialLoading);
    }, [initialData, initialLoading]);

    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            // If already sorted by this column, reverse the order
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            // Otherwise, sort by this column in ascending order
            setSortBy(columnName);
            setSortOrder("asc");
        }
    };

    const sortedData = data.sort((a, b) => {
        if (sortBy) {
            // If a sort column is selected, sort by that column
            const aValue =
                a[sortBy] != null
                    ? typeof a[sortBy] === "string"
                        ? a[sortBy].toLowerCase()
                        : a[sortBy]
                    : "";
            const bValue =
                b[sortBy] != null
                    ? typeof b[sortBy] === "string"
                        ? b[sortBy].toLowerCase()
                        : b[sortBy]
                    : "";
            if (aValue === null && bValue === null) {
                return 0;
            } else if (aValue === null) {
                return sortOrder === "asc" ? 1 : -1;
            } else if (bValue === null) {
                return sortOrder === "asc" ? -1 : 1;
            } else if (aValue < bValue) {
                return sortOrder === "asc" ? -1 : 1;
            } else if (aValue > bValue) {
                return sortOrder === "asc" ? 1 : -1;
            }
        }
        // If no sort column is selected, maintain the original order
        return 0;
    });

    return (
        <div>
            {!loading && data && (
                <table className='gen-table'>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th onClick={() => column.sort ? handleSort(column.id) : false}>
                                    {column.name} {sortBy === column.id && (sortOrder === "asc" ? "⏶" : "⏷")}
                                </th>
                            ))}
                            {auth.isLoggedIn && actions && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((data) => (
                            <tr key={data._id} onClick={() => onRowClick(data._id)}>
                                {columns.map((column) =>
                                    <td>{data[column.id]}</td>
                                )}

                                {auth.isLoggedIn && actions && (
                                    <td>
                                        <div className='button-group'>
                                            {actions.map((action) => (
                                                <IconOnlyButton
                                                    onClick={() => action.handleAction(data._id)}
                                                    icon={action.icon}
                                                    disabled={action.disabled.every((cond) => !data[cond])}
                                                    title={action.title}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Table;
