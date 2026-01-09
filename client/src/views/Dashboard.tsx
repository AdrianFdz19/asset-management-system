import React, { useEffect } from 'react'
import { useGetDashboardStatsQuery } from '../features/api/apiSlice'

export default function Dashboard() {

    const { data, isSuccess, isLoading, isFetching, isError, error } = useGetDashboardStatsQuery();

    useEffect(() => {
        if (data) console.log(data);
    }, [data]);

    let content;

    if (isLoading || isFetching) {
        content = <p>Loading dashboard stats...</p>
    } else if ( isError ) {
        content = <p>Error</p>
    } else if (isSuccess) {
        content = <p>stats...</p>
    }

  return (
    <div>Dashboard</div>
  )
}
