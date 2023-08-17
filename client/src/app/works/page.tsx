"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "@/utils/axios";
import { FaPlus } from "react-icons/fa";
import { fetchOwner } from "@/utils";
import { useRouter } from "next/navigation";

import { BiLink, BiSearch } from "react-icons/bi";
import { FcNext, FcPrevious } from "react-icons/fc";
import { CiSquareRemove } from "react-icons/ci";
import WorksTable from "@/components/Table/WorksTable";
import InputWork from "@/components/card/inputWork";
import ViewWorks from "@/components/card/ViewWorks";

const Works = () => {
  const router = useRouter();
  const PAGE_LIMIT = 10;
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [workData, setWorkData] = useState<any>([]);
  const [worksCount, setWorksCount] = useState<number>(0);
  const [user, setUser] = useState<any>({});
  const [accountType, setAccountType] = useState<string>("");
  const [work, setWork] = useState<object>();
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<boolean>(false);
  console.log("workData is Here :)", workData);
  useEffect(() => {
    if (showModal || showViewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showViewModal, showModal]);
  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;
    let updateUser = async () => {
      const user = await fetchOwner(userId);
      if (user && user._id) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        setAccountType(user?.role);
      } else {
        toast.error("You are not authorized to view this page");
        localStorage.removeItem("user");
        router.replace("/login");
      }
    };
    updateUser();
  }, []);

  const getWorksBySearch = async (e?: any) => {
    e && e.preventDefault();
    try {
      if (searchText?.trim()?.length > 0) {
        let { data } = await axios.get(
          `/work/get-all-works/search?&query=${searchText}`,
        );
        // console.log("users", data);
        if (!data.error) {
          // setSearchResults(data);
          setWorkData(data.works);
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      console.log("Error getting forms", error);
    }
  };

  useEffect(() => {
    const getHotels = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/work/get-all-works?page=${page}&limit=${PAGE_LIMIT}`,
        );
        // console.log(data);
        if (!data.error) {
          setWorkData(data.works);
          setWorksCount(data.worksCount);
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
    searchText.trim().length > 0 ? getWorksBySearch() : getHotels();
  }, [page, PAGE_LIMIT, reloadData]);

  const deleteWorkHandler = async (id: string) => {
    try {
      const { data } = await axios.post(`/work/delete-work`, {
        workId: id,
      });
      if (!data.error) {
        toast.success(data.message);
        const { data: users } = await axios.get(
          `/work/get-all-works?page=${page}&limit=${PAGE_LIMIT}`,
        );
        if (!data.error) {
          setWorkData(users.works);
          setWorksCount(data.worksCount);
        } else {
          toast.error(data.error);
        }
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // @ts-ignore
  return (
    <div className="flex w-full flex-col justify-center gap-4 items-center">
      <div className="flex w-full justify-between mt-6">
        <h1 className="text-2xl font-bold">Work Generate</h1>
        <button
          onClick={() => setShowModal(true)}
          type="submit"
          className=" flex  gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <FaPlus size={20} />
          <p>Work Generate</p>
        </button>
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
              disabled={page * PAGE_LIMIT >= worksCount}
              onClick={() => setPage(page + 1)}
              className="border p-3 shadow hover:bg-gray-200 cursor-pointer hover:opacity-90 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcNext />
            </button>
          </div>
          {/* <div className="ml-4 py-2 px-2 h-full border shadow rounded text-xs font-medium"> */}
          {/* <Select
            id="work"
            name="work"
            options={[{value: "all", label: "All Hotels"}, ...workData.map((work: any)=>({value: work._id, label: work.workName}))]}
            isMulti
            value={"coming soon"}
            onChange={()=>{
              toast.info("Search feature is not available yet")
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
            getWorksBySearch(e);
          }}
          className="w-full h-full text-xs mt-2 md:mt-0"
        >
          <div className="ml-auto border shadow md:w-[500px] h-full flex flex-row rounded-md overflow-hidden">
            <input
              placeholder="Search Hotels..."
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-full py-2 px-4   outline-none text-gray-700 "
            />
            <button
              className="min-w-[40px] flex justify-center items-center bg-blue-700 text-white cursor-pointer hover:opacity-90"
              onClick={(e) => {
                e.preventDefault();
                getWorksBySearch(e);
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
      <div className="flex w-full">
        <WorksTable
          setShowModal={(value) => setShowViewModal(value)}
          workData={workData}
          setWorkData={setWorkData}
          getWork={(work) => setWork(work)}
          deleteWorkHandler={deleteWorkHandler}
          owner={user}
          loading={loading}
        />
      </div>
      <ToastContainer theme="dark" position="bottom-center" autoClose={10000} />
      {showModal && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          {accountType === "ADMIN" && (
            <InputWork
              setWorkData={setWorkData}
              onClose={(value) => setShowModal(value)}
            />
          )}
        </div>
      )}
      {showViewModal && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          {accountType === "ADMIN" && (
            <ViewWorks
              // @ts-ignore`
              workData={work}
              onClose={(value) => setShowViewModal(value)}
            />
          )}
        </div>
      )}
      <div className="z-20 w-full flex flex-row justify-between items-center py-3 border-t-2">
        <div>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="mr-2 py-2 px-4 border rounded-md text-sm font-medium border-gray-300 text-gray-500 cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={page * PAGE_LIMIT >= worksCount}
            onClick={() => setPage(page + 1)}
            className="py-2 px-4 border rounded-md text-sm font-medium border-gray-300 text-gray-500 cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="text-gray-500 text-sm">
          {" "}
          <div>{`Page ${page} of ${Math.ceil(worksCount / PAGE_LIMIT)}`}</div>
        </div>
      </div>
    </div>
  );
};

export default Works;
