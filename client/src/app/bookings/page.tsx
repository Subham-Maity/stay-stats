"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BookingTable from "@/components/Table/BookingTable";
import axios from "@/utils/axios";
import { ToastContainer, toast } from "react-toastify";
import { FaPlus, FaTimes } from "react-icons/fa";
import InputBooking from "@/components/card/inputBooking";
import ViewBooking from "@/components/card/ViewBookings";
import { fetchOwner } from "@/utils";
import { FcNext, FcPrevious } from "react-icons/fc";
import { CiSquareRemove } from "react-icons/ci";
import { BiSearch } from "react-icons/bi";
import Filter from "@/components/card/Filter";
import { SiMicrosoftexcel } from "react-icons/si";
import { utils, writeFile } from "xlsx";
import { FRONTEND_URL } from "@/constants/constant";
import EditBooking from "@/components/card/EditBooking";

const Bookings = () => {
  let router = useRouter();
  const PAGE_LIMIT = 20;
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState(""); // {users: [], usersCount: 0}
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<any>();
  const [bookingData, setBookingData] = useState<any>([]);
  const [bookingCounts, setBookingCounts] = useState<number>(0);
  const [booking, setBooking] = useState<any>();
  const [showViewModal, setShowViewModal] = useState<boolean>();
  const [user, setUser] = useState<any>({});
  const [accountType, setAccountType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingBookingData, setEditingBookingData] = useState<object>({});
  const [onFilterOpen, setOnFilterOpen] = useState<boolean>(false);

  const [showDownloadPopUp, setShowDownloadPopUp] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (showModal || showViewModal || showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showViewModal, showModal, showEditModal]);

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;
    let updateUser = async () => {
      const user = await fetchOwner(userId);

      if (user && user._id && user.isActive) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        setAccountType(user?.role);
      } else {
        toast.error("You are not authorized to view this page");
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");

        window.open(`${FRONTEND_URL}/login`, "_self");
      }
    };
    updateUser();
  }, []);

  // useEffect(()=>{
  //   console.log(filterData)
  // },[filterData])

  const getBookingsBySearch = async (e?: any) => {
    setFilterData(null);
    e && e.preventDefault();
    try {
      if (searchText?.trim()?.length > 0) {
        let { data } = await axios.get(
          `/booking/get-all-bookings/search?&query=${searchText}`
        );
        // console.log("forms", data);
        if (!data.error) {
          // setSearchResults(data);
          setBookingData(data.bookings);
          data.message && toast.info(data.message);
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      console.log("Error getting forms", error);
    }
  };

  useEffect(() => {
    const getBookings = async () => {
      try {
        setLoading(true);

        const { data } = await axios.post(
          `/booking/get-all-bookings?page=${page}&limit=${PAGE_LIMIT}&filterBy=${filterData?.filterBy}&hotelName=${filterData?.hotelName}&bookingSource=${filterData?.bookingSource}&guestName=${filterData?.guestName}&serialNumber=${filterData?.serialNumber}&status=${filterData?.status}&addedBy=${filterData?.addedBy}`,
          {
            startDate: filterData?.dateRange?.startDate ?? null,
            endDate: filterData?.dateRange?.endDate ?? null,
          }
        );
        if (!data.error) {
          setBookingData(data.bookings);
          setBookingCounts(data.bookingsCount);
          data.message && toast.info(data.message);
        } else {
          toast.error(data.error);
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message);
        console.log(error);
      }
    };
    searchText.trim().length > 0 ? getBookingsBySearch() : getBookings();
  }, [page, PAGE_LIMIT, reloadData, filterData]);

  const cancelBookingHandler = async (bookingId: string) => {
    setFilterData(null);
    try {
      const { data } = await axios.post(`/booking/cancel-booking`, {
        bookingId,
        status: "CANCELLED",
      });
      if (!data.error) {
        toast.success(data.message);
        const { data: bookingData } = await axios.post(
          `/booking/get-all-bookings?page=${page}&limit=${PAGE_LIMIT}&filterBy=${filterData?.filterBy}&hotelName=${filterData?.hotelName}&bookingSource=${filterData?.bookingSource}&guestName=${filterData?.guestName}&serialNumber=${filterData?.serialNumber}&status=${filterData?.status}&addedBy=${filterData?.addedBy}`,
          {
            startDate: filterData?.dateRange?.startDate ?? null,
            endDate: filterData?.dateRange?.endDate ?? null,
          }
        );
        if (!bookingData.error) {
          setBookingData(bookingData.bookings);
          setBookingCounts(bookingData.bookingsCount);
        } else {
          toast.error(bookingData.error);
        }
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleDownload = async () => {
    const getBookingsFordownload = async () => {
      try {
        const { data } = await axios.post(
          `/booking/get-all-bookings?filterBy=${filterData?.filterBy}&hotelName=${filterData?.hotelName}&bookingSource=${filterData?.bookingSource}&guestName=${filterData?.guestName}&serialNumber=${filterData?.serialNumber}&status=${filterData?.status}&addedBy=${filterData?.addedBy}`,
          {
            startDate: filterData?.dateRange?.startDate ?? null,
            endDate: filterData?.dateRange?.endDate ?? null,
          }
        );
        if (!data.error) {
          return data.bookings;
        } else {
          toast.error(data.error);
        }
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
      }
    };

    let bookingDataFormDownload = await getBookingsFordownload();

    let bookingDataForExcel = bookingDataFormDownload.map((booking: any) => {
      return {
        "Reservation Number": booking.serialNumber,
        "Hotel Name": booking.hotel?.hotelName,
        "Guest Name": booking.guestName,
        "Guest Contact": booking.contactNumber,
        "Guest Email": booking.guestEmail ? booking.guestEmail : "No Data",
        "Check-In Date": new Date(booking.checkInDate).toDateString(),
        "Check-Out Date": new Date(booking.checkOutDate).toDateString(),
        "Number of Rooms": booking.numberOfRooms,
        "Number of Person": booking.numberOfPersons,
        "Room Category": booking.roomCategory,
        "Booking Amount": booking.bookingAmount,
        "Advance Amount": booking.advanceAmount,
        "Due Amount": booking.dueAmount,
        "Advance Date": new Date(booking.advanceDate).toDateString(),
        "Account Type": booking.accountType,
        "Booking Source": booking.bookingSource,
        "Booked By": booking.bookingBy,
        "Booking Status": booking.status,
        Plan: booking.plan,
        Remarks: booking.remarks,
      };
    });

    const worksheet = utils.json_to_sheet(bookingDataForExcel);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");
    writeFile(
      workbook,
      `Bookings-${user.name || user.username}-${new Date().toDateString()}.xlsx`
    );
  };

  return (
    <div className="flex w-full flex-col justify-center gap-4 items-center overflow-hidden">
      <div className="flex w-full justify-between px-2 items-center gap-4 lg:gap-0 mt-6">
        <h1 className="lg:text-2xl text-lg whitespace-nowrap font-bold">
          Booking Details
        </h1>
        <div className="flex gap-2">
          {user.role === "ADMIN" && (
            <>
            <button onClick={()=> setOnFilterOpen(!onFilterOpen)} className="defaultBtn">
        Filter
      </button>
            <button
              onClick={() => {
                setShowDownloadPopUp(true);
              }}
              className="defaultBtn"
            >
              <SiMicrosoftexcel size={20} />
              <p className="whitespace-nowrap text-sm hidden lg:block">
                Download Excel
              </p>
            </button>
            
            </>
            
          )}
          <button
            onClick={() => setShowModal(true)}
            type="submit"
            className="defaultBtn"
          >
            <FaPlus size={20} />
            <p className="whitespace-nowrap text-sm hidden lg:block">
              Add Booking
            </p>
          </button>
        </div>
      </div>
      <div className="w-full m-2">
        <Filter
        isFilterOpen={onFilterOpen}
          setFilterData={(filter: any) => {
            setFilterData(filter);
            setReloadData(!reloadData);
            setPage(1);
          }}
        />
      </div>
      <div className="md:h-[40px] my-4 sm:my-6 text-gray-600 flex flex-col md:flex-row items-center w-full">
        <div className="h-full flex flex-row  items-center mr-auto">
          <div className="flex flex-row h-full text-gray-700">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="border p-3 shadow hover:bg-gray-200 cursor-pointer hover:opacity-90 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcPrevious />
            </button>
            <button
              disabled={page * PAGE_LIMIT >= bookingCounts}
              onClick={() => setPage(page + 1)}
              className="border p-3 shadow hover:bg-gray-200 cursor-pointer hover:opacity-90 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcNext />
            </button>
          </div>
          {/* <div className="ml-4 py-2 px-2 h-full border shadow rounded text-xs font-medium"> */}
          {/* <Select
              id="hotel"
              name="hotel"
              options={[
                { value: "all", label: "All Users" },
                ...userData.map((user: any) => ({
                  value: user._id,
                  label: user.username,
                })),
              ]}
              isMulti
              value={"coming soon"}
              onChange={() => {
                toast.info("Search feature is not available yet");
                // handleHotelSelection()
              }}
              className="w-[80px] outline-none ml-4 px-2 h-full shadow rounded text-xs font-medium"
              isDisabled={loading}
            /> */}
          {/* </div> */}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getBookingsBySearch(e);

            // toast.info("Search feature is not available yet");
          }}
          className="w-full h-full text-xs mt-2 md:mt-0"
        >
          <div className="ml-auto border shadow md:w-[500px] h-full flex flex-row rounded-md overflow-hidden">
            <input
              placeholder="Search Bookings..."
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-full py-2 px-4 dark:bg-[#282f46] outline-none text-gray-700 dark:text-white"
            />
            <button
              className="min-w-[40px] flex justify-center items-center defaultBtn"
              onClick={(e) => {
                getBookingsBySearch(e);
                // e.preventDefault();
                // toast.info("Search feature is not available yet");
              }}
            >
              <BiSearch className="text-xl" />
            </button>
            <div className="min-w-[40px] flex items-center justify-center">
              <CiSquareRemove
                size={40}
                className=" text-red-500 cursor-pointer"
                onClick={() => {
                  setSearchText("");
                  setReloadData(!reloadData);
                }}
              />
            </div>
          </div>
        </form>
      </div>
      <div className={` flex w-full`}>
        <BookingTable
          owner={user}
          setBookingData={setBookingData}
          setShowModal={(value) => setShowViewModal(value)}
          getBooking={(booking) => setBooking(booking)}
          cancelBookingHandler={cancelBookingHandler}
          bookingData={bookingData}
          loading={loading}
        />
      </div>
      <ToastContainer theme="dark" position="bottom-center" autoClose={10000} />
      {showModal && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          {(accountType === "ADMIN" || accountType === "SUBADMIN") && (
            <InputBooking
              user={user}
              setBookingData={setBookingData}
              onClose={(value) => setShowModal(value)}
            />
          )}
        </div>
      )}
      {showViewModal && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <ViewBooking
            setShowEditModal={(value) => setShowEditModal(value)}
            cancelBookingHandler={cancelBookingHandler}
            onClose={(value) => setShowViewModal(value)}
            booking={booking}
            setEditingBookingData={(value) => setEditingBookingData(value)}
          />
        </div>
      )}
      {showEditModal && editingBookingData && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <EditBooking
            onClose={(value) => setShowEditModal(value)}
            setBookingData={setBookingData}
            editingBookingDataProps={editingBookingData}
            bookingData={bookingData}
            owner={user}
          />
        </div>
      )}
      <div className="z-10 w-full flex flex-row justify-between items-center py-3 ">
        <div>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="mr-2 py-2 px-4 border rounded-md text-sm font-medium border-gray-300 text-gray-500 cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={page * PAGE_LIMIT >= bookingCounts}
            onClick={() => setPage(page + 1)}
            className="py-2 px-4 border rounded-md text-sm font-medium border-gray-300 text-gray-500 cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="text-gray-500 text-sm">
          {" "}
          <div>{`Page ${page} of ${Math.ceil(
            bookingCounts / PAGE_LIMIT
          )}`}</div>
        </div>
      </div>
      {showDownloadPopUp && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">
                Downlod data in a Excel file
              </h1>
              <button
                disabled={downloading}
                onClick={() => setShowDownloadPopUp(false)}
                className="text-red-500 text-lg disabled:opacity-50"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to download?
            </p>
            <span className="text-sm text-gray-500 mt-2">
              This might take some time!
            </span>
            <div className="flex justify-end items-center mt-6">
              <button
                onClick={() => setShowDownloadPopUp(false)}
                className="text-sm text-white rounded-md bg-gray-500 mr-4 p-2 disabled:opacity-50"
                disabled={downloading}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setDownloading(true);
                  await handleDownload();
                  setDownloading(false);
                  setShowDownloadPopUp(false);
                }}
                className="text-sm text-white font-semibold rounded-md bg-indigo-500 p-2 disabled:opacity-50"
                disabled={downloading}
              >
                {downloading ? "Downloading" : "Download"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
