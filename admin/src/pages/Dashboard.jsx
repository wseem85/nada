import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { calculateData } from '../utils/helpers';
import { AppContext } from '../contexts/contexts';
import DashboardSkeleton from '../skeletons/DashboardSkeleton';
import { getErrorMessage } from '../utils/errorHandler';
import { useCallback } from 'react';
// import { AdminContext } from '../../context/contexts';
// import { assets } from '../../assets/assets';
const Dashboard = () => {
  const data = calculateData();
  const { backendUrl } = useContext(AppContext);
  const [storeStats, setStoreStats] = useState({});
  const [errorGettingStats, setErrorGettingStats] = useState('');
  const [loadingStats, setLoadingstats] = useState(true);
  const getStoreStats = useCallback(async () => {
    try {
      setLoadingstats(true);
      const data = await axios.get(backendUrl + '/api/admin/store-stats');
      console.log(data.data);
      if (data.data.status === 'success') {
        setStoreStats(data.data.data);
      } else {
        toast.error('Failed to fetch artworks stats');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch artworks stats');
      setErrorGettingStats(getErrorMessage(error));
    } finally {
      setLoadingstats(false);
    }
  }, [backendUrl]);
  useEffect(() => {
    async function getData() {
      await getStoreStats();
    }
    getData();
  }, [getStoreStats]);

  if (loadingStats) {
    return <DashboardSkeleton />;
  }
  // return null;
  if (errorGettingStats) {
    return (
      <div className="h-screen flex flex-col gap-8 justify-center items-center">
        <p className="text-2xl tracking-widest text-center text-gray-600">
          {' '}
          Something Went Wrong!
        </p>
        <p className="text-center text-sm text-red-400">{errorGettingStats}</p>
      </div>
    );
  }
  return (
    <div className="m-5 flex-1 px-4 max-w-2xl xl:max-w-3xl mx-auto ">
      <div className="flex flex-col gap-3 ">
        <h3 className="text-2xl font-bold text-center mt-6">Artworks</h3>
        <div className="grid grid-cols-2 gap-3 justify-center ">
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img className="w-12" src="../../src/assets/artwork.png" />
                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.artworksStats[0].total}
                </p>
              </div>
              <p className="text-gray-400">Total Artworks</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            {/* <img className="w-14" src={assets.doctor_icon} alt="" /> */}
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img className="w-8" src="../../src/assets/soldout.png" />
                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.artworksStats[0].soldOut}
                </p>
              </div>
              <p className="text-gray-400">Sold Out </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img className="w-8 " src="../../src/assets/instock.png" />
                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.artworksStats[0].inStore}
                </p>
              </div>
              <p className="text-gray-400">Available </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img className="w-8" src="../../src/assets/onsale.png" alt="" />
                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.artworksStats[0].deleted}
                </p>
              </div>
              <p className="text-gray-400">Deleted </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-bold text-center mt-6">Orders</h3>
        <div className="grid grid-cols-2 gap-3 justify-center  ">
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img className="w-8" src="../../src/assets/orders.png" alt="" />

                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.ordersStats[0].total}
                </p>
              </div>
              <p className="text-gray-400">Total Orders</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img
                  className="w-8 h-8"
                  src="../../src/assets/delivered.png"
                  alt=""
                />

                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.ordersStats[0].delevered}
                </p>
              </div>
              <p className="text-gray-400">Delivered </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img
                  className="w-8 h-8"
                  src="../../src/assets/paid.png"
                  alt=""
                />
                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.ordersStats[0].paid}
                </p>
              </div>
              <p className="text-gray-400">Paid </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img
                  className="w-8 h-8"
                  src="../../src/assets/pending.png"
                  alt=""
                />
                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.ordersStats[0].pending}
                </p>
              </div>
              <p className="text-gray-400">Pending </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-bold text-center mt-6">Users</h3>
        <div className="grid grid-cols-1 gap-3 justify-center  ">
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-12 items-center  ">
                <img
                  className="w-8 h-8"
                  src="../../src/assets/users.png"
                  alt=""
                />
                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.totalUsers[0].total}
                </p>
              </div>
              <p className="text-gray-400">Total Users</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 bg-white p-4  rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="flex gap-4">
              {storeStats.topFans.map((item) => (
                <div
                  key={item.userId}
                  className="flex flex-col gap-1 items-center"
                >
                  <div className="flex gap-1 items-center">
                    <img
                      src={`${
                        item.photo
                          ? item.photo
                          : '../../src/assets/profile_default_pic.png'
                      }`}
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="text-xs">{item.name}</p>
                  </div>
                  <p className="text-gray-400 text-xs">
                    added +{item.reviewCount} Reviews
                  </p>
                </div>
              ))}
            </div>
            <p className="text-gray-400">Top Fans </p>
          </div>
          <div className="flex flex-col items-start gap-2 bg-white p-4  rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="flex gap-4">
              {storeStats.topCustomers.map((item) => (
                <div
                  key={item.email}
                  className="flex flex-col gap-1 items-center"
                >
                  <div className="flex gap-1 items-center">
                    <img
                      src={`${
                        item.photo
                          ? item.photo
                          : '../../src/assets/profile_default_pic.png'
                      }`}
                      className="w-8 h-8 rounded-full"
                    />

                    <p className="text-xs">{item.name}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Ordered +{item.orderCount} times
                  </p>
                </div>
              ))}
            </div>
            <p className="text-gray-400">Top Customers </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-bold text-center mt-6">Reviews</h3>
        <div className="grid grid-cols-2 gap-3 justify-center">
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img
                  className="w-8 h-8"
                  src="../../src/assets/review.png"
                  alt=""
                />

                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.ratingStats[0].total}
                </p>
              </div>
              <p className="text-gray-400">Total Reviews</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img
                  className="w-8 h-8"
                  src="../../src/assets/5stars.png"
                  alt=""
                />
                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.ratingStats[0].rating5}
                </p>
              </div>
              <p className="text-gray-400">Artworks got 5 Stars </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img
                  className="w-8 h-8"
                  src="../../src/assets/4stars.png"
                  alt=""
                />
                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.ratingStats[0].rating4}
                </p>
              </div>
              <p className="text-gray-400"> Artworks got 4 Stars </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-40 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <div className="space-y-6 w-full">
              <div className="flex gap-4 items-center justify-between">
                <img
                  className="w-8 h-8"
                  src="../../src/assets/3stars.png"
                  alt=""
                />
                <p className="text-xl font-semibold text-gray-600">
                  {storeStats.ratingStats[0].rating3}
                </p>
              </div>
              <p className="text-gray-400">Artworks got 3 Stars </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
