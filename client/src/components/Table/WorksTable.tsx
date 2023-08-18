"use client";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { MdFileDownloadDone, MdWarningAmber } from "react-icons/md";
import { TbLoader } from "react-icons/tb";
import { FiEdit, FiExternalLink } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import EditHotel from "../card/EditHotel";
import { InfinitySpin } from "react-loader-spinner";
import EditWorks from "@/components/card/EditWorks";
import { Button } from "flowbite-react";
interface TableProps {
  workData: {
    userName?: { name: string; _id: string; userName: string };
    workDetails?: string;
    finishDeadline?: string;
    updatedAt?: string;
    workConfirm?: string;
    serialNumber?: string;
  }[];

  setWorkData: any;
  getWork: (work: object) => void;
  setShowModal: (value: boolean) => void;
  deleteWorkHandler: (id: string) => void;
  owner?: any;
  loading?: boolean;
}

const WorksTable = ({
  workData,
  setWorkData,
  getWork,
  setShowModal,
  deleteWorkHandler,
  owner,
  loading,
}: TableProps) => {
  const [showEditWorkModal, setShowEditWorkModal] = useState<boolean>(false);
  const [editingWorkData, setEditingWorkData] = useState<object>({});
  const [showDeletePopup, setShowDeletePopUp] = useState<boolean>(false);
  const [workId, setWorkId] = useState<string>("");
  useEffect(() => {
    if (showEditWorkModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showEditWorkModal]);
  console.log("Table Work" + workData);
  const handleShowDeleteModal = (id: string) => {
    setWorkId(id);

    setShowDeletePopUp(true);
  };

  const acceptWorkHandler = {};
  const showAcceptModal = () => {};

  const showRejectModal = () => {};

  return (
    <div className="w-full">
      <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg cursor-pointer">
        <table className="w-full border-white border-2 text-sm text-left text-gray-500  dark:bg-inherit  dark:text-gray-400">
          <thead className="text-sm text-gray-900 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                #
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                User Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Work Details
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Modified Date
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Finish Deadline
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Remarks
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Options
              </th>
            </tr>
          </thead>
          <tbody className="rounded-xl">
            {workData.length === 0 && (
              <tr className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <TbLoader className="text-4xl text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </tr>
            )}

            {workData.length > 0 && (
              <>
                {loading ? (
                  <div className=" m-auto">
                    <InfinitySpin width="200" color="#4fa94d" />
                  </div>
                ) : (
                  workData.map((work: any, index: number) => {
                    //   console.log(hotel.hotelName);

                    return (
                      <tr
                        key={index}
                        className="light:bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          className="text-center px-6 py-2 font-medium text-gray-500 whitespace-nowrap dark:text-white"
                        >
                          {work.serialNumber || ""}
                        </th>
                        <td className="px-6 py-2 text-center">
                          {work.userName.name || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {work.workDetails || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {new Date(work.updatedAt).toDateString() || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {work.workConfirm || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {new Date(work.finishDeadline).toDateString() || ""}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {work.remarks || "no remarks"}
                        </td>

                        <td className="px-6 py-2 text-center">
                          {owner.role !== "SUBADMIN" ? (
                            <div className="flex justify-center items-center">
                              <button
                                // disabled={work.createdBy._id !== owner._id}
                                data-tip={"Preview Link"}
                                onClick={() => {
                                  console.log("chal nubbb" + work);
                                  getWork(work);
                                  setShowModal(true);
                                }}
                                className={`w-fit text-center p-2 shadow border bg-gray-100 text-blue-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
                              >
                                <AiOutlineEye className="" />
                              </button>
                              <button
                                disabled={
                                  work.createdBy._id !== owner._id &&
                                  owner.role !== "ADMIN"
                                }
                                // data-tip={"Preview Link"}
                                onClick={() => {
                                  setShowEditWorkModal(true);
                                  setEditingWorkData(work);
                                }}
                                className={`w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50`}
                              >
                                <FiEdit className="" />
                              </button>
                              <button
                                disabled={
                                  work.createdBy._id !== owner._id &&
                                  owner.role !== "ADMIN"
                                }
                                data-tip={"Delete Hotel"}
                                onClick={() => {
                                  handleShowDeleteModal(work._id);
                                }}
                                className={`w-fit text-center p-2 shadow border bg-gray-100 text-red-500  hover:opacity-90 text-sm rounded-md disabled:opacity-50`}
                              >
                                <RiDeleteBin6Line size={15} className="" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                // disabled={user.addedBy !== owner._id}
                                onClick={() => {
                                  showAcceptModal();
                                }}
                                data-tip={"update Lead"}
                                className={`w-fit text-center p-2 shadow border bg-gray-100 text-green-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50 flex gap-2 items-center justify-center font-semibold`}
                              >
                                <MdFileDownloadDone
                                  size={20}
                                  className="inline-block"
                                />{" "}
                                Accept
                              </button>
                              <button
                                // disabled={user.addedBy !== owner._id}
                                data-tip={"update Lead"}
                                className={`w-fit text-center p-2 shadow border bg-gray-100 text-red-500  hover:opacity-90 text-sm rounded-md mr-2 disabled:opacity-50 flex gap-2 items-center justify-center font-semibold`}
                              >
                                <MdFileDownloadDone
                                  size={20}
                                  className="inline-block"
                                />{" "}
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      {showEditWorkModal && editingWorkData && (
        <div className="z-50 w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <EditWorks
            onClose={(value) => setShowEditWorkModal(value)}
            setWorkData={setWorkData}
            editingWorkDataProps={editingWorkData}
            workData={workData}
          />
        </div>
      )}
      {showDeletePopup && (
        <div className="w-full bg-black/50 h-screen fixed top-0 left-0 flex justify-center items-center overflow-hidden">
          <div className="w-1/3 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Delete Hotel</h1>
              <button
                onClick={() => setShowDeletePopUp(false)}
                className="text-red-500 text-lg"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this hotel?
            </p>
            <div className="flex justify-end items-center mt-6">
              <button
                onClick={() => setShowDeletePopUp(false)}
                className="text-sm text-gray-500 mr-4"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteWorkHandler(workId);
                  setShowDeletePopUp(false);
                }}
                className="text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorksTable;
