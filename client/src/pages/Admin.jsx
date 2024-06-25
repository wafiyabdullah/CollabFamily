import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { IoIosRefresh } from 'react-icons/io';
import clsx from 'clsx';
import Title from '../components/Title';
import Loading from '../components/Loader';
import { dateFormatter } from '../utils';
import {
  useGetNotificationsQuery,
} from '../redux/slices/api/adminApiSlice';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from '../components/PDFDocument';

const AdminPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const { data, isLoading: isLoadingData, refetch } = useGetNotificationsQuery();

  useEffect(() => {
    if (user) {
      setLoading(true);
      refetch()
        .then(() => setLoading(false))
        .catch((error) => {
          setLoading(false);
          console.log('Error fetching data:', error);
        });
    }
  }, [user, refetch]);

  const refreshPage = async () => {
    try {
      await refetch();
      toast.info('Data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleExportPDF = () => {
    // Implement PDF export logic here
    toast.info('Exporting PDF...');
  };

  const renderStatistics = () => {
    const { statistics } = data?.response || {};

    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <Title title="Statistics" />
          <div className="flex flex-col gap-4">
            <div>
              <strong>Total Users:</strong> {statistics?.usersCount || 'Loading...'}
            </div>
            <div>
              <strong>Total Families:</strong> {statistics?.familiesCount || 'Loading...'}
            </div>
            <div>
              <strong>Total Tasks:</strong> {statistics?.tasksCount || 'Loading...'}
            </div>
            <div>
              <strong>Total Bills:</strong> {statistics?.billsCount || 'Loading...'}
            </div>
            <div>
              <strong>Total Notifications:</strong>{' '}
              {statistics?.notificationsCount || 'Loading...'}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Title title="Export Reports" className="pb-3" />
          <div className="flex flex-col gap-4">
            <PDFDownloadLink
                document={<PDFDocument data={data?.response} />}
                fileName="CollabFamily_report.pdf"
                className="bg-violet-700 px-8 text-sm font-semibold text-white hover:bg-violet-600 rounded text-center py-2"
              >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Export PDF')}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationsTable = () => {
    const { notifications } = data?.response || [];

    return (
      <div className="w-full bg-white px-2 md:px-4 py-4 rounded shadow mt-4">
        <div className="overflow-x-auto">
          {isLoadingData ? (
            <Loading />
          ) : (
            <div className="w-full">
              <Title title="Notifications" className="pb-3" />
              <table className="w-full mb-1 border">
                <thead className="border-b border-gray-300">
                  <tr className="text-black text-left">
                    <th className="py-2">Type</th>
                    <th className="py-2">Type Title</th>
                    <th className="py-2">Datelines</th>
                    <th className="py-2">Family ID</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Sent</th>
                    <th className="py-2">Successful</th>
                    <th className="py-2">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((noti, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10"
                    >
                      <td className="pt-2">{noti.type}</td>
                      <td className="pt-2">{noti.typeTitle}</td>
                      <td className="pt-2">{dateFormatter(noti.typeDatelines)}</td>
                      <td className="pt-2">{noti.FamilyId}</td>
                      <td
                        className={clsx('pt-2', statusNotiColor[noti.status])}
                      >
                        {noti.status}
                      </td>
                      <td className="pt-2">
                        {dateFormatter(noti.sentAt ? noti.sentAt : 'null')}
                      </td>
                      <td className="pt-2">
                        {dateFormatter(noti.successfulAt ? noti.successfulAt : 'null')}
                      </td>
                      <td className="pt-2">{dateFormatter(noti.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const statusNotiColor = {
    Successful: 'bg-green-100',
    Waiting: 'bg-yellow-100',
    Failed: 'bg-red-100',
    Canceled: 'bg-slate-200',
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-4 gap-3">
        <Title title="Welcome Admin" className="text-black"/>
        <div className="rounded-full hover:bg-slate-200 p-1 flex justify-center items-center">
          <IoIosRefresh onClick={refreshPage} />
        </div>
      </div>

      {renderStatistics()}
      {renderNotificationsTable()}
    </div>
  );
};

export default AdminPage;
