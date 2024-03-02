"use client";
import axios from "@/utils/axios";
import Select from "react-select";
import React, { useState, useEffect, useRef } from "react";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { MdAutoFixHigh } from "react-icons/md";
import generator from "generate-password";
import TailwindWrapper from "../dash/Components/Wrapper/TailwindWrapper";

interface Props {
  setUserData: (users: any) => void;
  onClose: (value: boolean) => void;
  editingUserDataProps: any;
  userData: any;
}

const EditUser = ({
  setUserData,
  onClose,
  editingUserDataProps,
  userData,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableHotels, setAvailableHotels] = useState<any>([]);
  const [selectedHotels, setSelectedHotels] = useState<any>([]);
  const [editingUserData, setEditingUserData] = useState<any>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>("");

  const [reactSelectOptions, setReactSelectOptions] = useState<any>([]);

  useEffect(() => {
    const getHotelsAndUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post("/hotel/get-all-hotels");
        if (!data.error) {
          setAvailableHotels(data.hotels);
          let options = data.hotels.map((hotel: any) => {
            return { value: hotel._id, label: hotel.hotelName };
          });
          setReactSelectOptions(options);
          setEditingUserData(editingUserDataProps);
          setSelectedHotels(
            editingUserDataProps.hotel.map((hotel: any) => {
              return { value: hotel._id, label: hotel.hotelName };
            })
          );
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
    getHotelsAndUser();
  }, [editingUserDataProps]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues: { [key: string]: string } = {};

    // Collect all the form field values
    formData.forEach((value, key) => {
      formValues[key] = value as string;
      if (formValues[key].trim() === "") {
        if (key !== "password") {
          toast.error("Please fill all the fields");
        }
        return;
      }
    });

    const numberRegex = /^[0-9]+$/;
    const nameRegex = /^[a-zA-Z ]+$/;
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

    if (formValues.phone.length !== 10) {
      toast.error("Please enter a valid phone number and don't include +91");
      return;
    }

    if (
      formValues.first_name.trim() == "" &&
      !nameRegex.test(formValues.first_name)
    ) {
      toast.error("Please enter a valid name");
      return;
    }

    if (formValues.email.trim() == "" && !emailRegex.test(formValues.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/user/update-user", {
        id: editingUserData._id,
        name: formValues.first_name,
        username: formValues.email,
        phoneNumber: formValues.phone,
        email: formValues.email,
        password: formValues.password !== "" ? formValues.password : null,
        hotel: selectedHotels.map((hotel: any) => hotel.value),
        // role: "SUBADMIN",
      });
      if (!data.error) {
        // const { data } = await axios.post("/user/get-users");
        const userIndex = userData.findIndex(
          (user: any) => user._id === editingUserDataProps._id
        );

        // If the user is found in the array, replace the data at that index
        if (userIndex !== -1) {
          setUserData((prev: any) => {
            const updatedUserData = [...prev];
            updatedUserData[userIndex] = data.user;
            return updatedUserData;
          });
        }

        onClose(false);
        toast.success(data.message);
        formRef.current?.reset();
      } else {
        toast.error(data.error);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleHotelSelection = (selectedOptions: any) => {
    setSelectedHotels(selectedOptions);
  };

  const autoGeneratePassword = () => {
    let autoGeneratedPassword = generator.generate({
      length: 8,
      numbers: true,
      uppercase: true,
    });
    setInputPassword(autoGeneratedPassword);

    toast.success(`Password generated automatically`);
  };

  return (

    <form
      ref={formRef}
      className="p-6 items-center rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 w-full"
      onSubmit={handleUpdate}
    >
      <TailwindWrapper>
      <div className="flex w-full mb-6">
        <p className="font-bold text-lg">User Details</p>
        <span
          onClick={() => onClose(false)}
          className="ml-auto cursor-pointer text-xl"
        >
          &times;
        </span>
      </div>
      <div className="grid gap-4 grid-cols-3 md:grid-cols-3">
        <div>
          <label
            htmlFor="first_name"
            className="block mb-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
            placeholder="Ex: Digha Saikatabas"
            value={!loading ? editingUserData.name : "fetching.."}
            required
            onChange={(e) => {
              setEditingUserData((prev: any) => {
                return { ...prev, name: e.target.value.toLocaleUpperCase() };
              });
            }}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className=" whitespace-nowrap block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50 ${
              loading ? "text-blue-400" : ""
            } `}
            placeholder="999999999"
            // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
            value={editingUserData.phoneNumber}
            onChange={(e) => [
              setEditingUserData((prev: any) => {
                return { ...prev, phoneNumber: e.target.value };
              }),
            ]}
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
          >
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
            placeholder="hotel@company.com"
            value={!loading ? editingUserData.email : "fetching.."}
            required
            onChange={(e) => {
              setEditingUserData((prev: any) => {
                return { ...prev, email: e.target.value };
              });
            }}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="role"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Role
          </label>
          <input
            type="text"
            name="role"
            id="role"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
            
            value={!loading ? editingUserData.role : "fetching.."}
            required
            disabled
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="flex gap-2 mb-[3px] text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
            <div
              className="ml-auto bg-green-200 rounded-md p-1 hover:bg-green-700 hover:text-white cursor-pointer"
              onClick={autoGeneratePassword}
            >
              <MdAutoFixHigh className="text-base" />
            </div>
          </label>
          <div className="relative ">
            <input
              type={showPassword ? "text" : "password"}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              
              name="password"
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
              }}
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
              onClick={handleShowPassword}
            >
              {showPassword ? (
                <RiEyeLine size={20} />
              ) : (
                <RiEyeCloseLine size={20} />
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="w-[340px]">
          <label
            htmlFor="hotel"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Hotel Name <span className="text-red-500">*</span>
          </label>
          <Select
            id="hotel"
            name="hotel"
            options={reactSelectOptions}
            isMulti
            value={!loading ? selectedHotels : ["Fetching..."]}
            onChange={handleHotelSelection}
            className="w-full break-before-all dark:bg-gray-600 dark:text-black"
            isDisabled={loading}
          />
          {availableHotels.length === 0 && (
            <div className="text-xs text-red-600 font-medium">
              No Hotels Available*
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="defaultBtn my-4"
        disabled={
          loading || availableHotels.length === 0 || selectedHotels.length === 0
        }
      >
        {loading ? 'Please wait...' : 'Update'}
      </button>
      </TailwindWrapper>
    </form>
  );
};

export default EditUser;