import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import CustomSelect from "../../../../components/clients/Select";

import { getLastestArticles } from "../../../../api/clients/articleApi";
import BigArticleCard from "../../../../components/clients/home_page/BigArticleCard";

const Home = () => {
  const [search, setSearch] = useState("");
  const [orgUnit, setOrgUnit] = useState(null);
  const [func, setFunc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latestArticles, setLatestArticles] = useState([]);
  const orgUnitOptions = [
    { value: "all", label: "All" },
    { value: "unit1", label: "Unit 1" },
    { value: "unit2", label: "Unit 2" },
  ];

  const funcOptions = [
    { value: "all", label: "All" },
    { value: "func1", label: "Function 1" },
    { value: "func2", label: "Function 2" },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getLastestArticles(5);
        console.log(response);
        setLatestArticles(response.data); 
      } catch (err) {
        console.error(err);
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="bg-[#f9fafc] min-h-screen py-6 border-2">
      <div className="flex max-w-310 mx-auto border-2">
        {/* LEFT SIDE */}

        <div className="flex-1 min-h-screen px-10">
          {/* Search box with filters */}

          <div className="bg-white shadow-sm rounded-xl flex h-20 w-fit gap-2 items-center mb-4">
            {/* Search Input */}
            <div className="relative h-full border-r border-gray-300">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Eg: Anticoagulation"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-full w-80 px-12 py-2 focus:outline-none"
              />
            </div>

            <CustomSelect
              label="LEVEccc"
              value={orgUnit}
              onChange={setOrgUnit}
              options={orgUnitOptions}
            />

            <CustomSelect
              label="LEVEccc"
              value={orgUnit}
              onChange={setOrgUnit}
              options={orgUnitOptions}
            />

            <CustomSelect
              label="LEVEccc"
              value={orgUnit}
              onChange={setOrgUnit}
              options={orgUnitOptions}
              noBorder
            />
          </div>

          <p className="text-base mb-3 italic text-neutral-600 font-bold">
            Tin tức mới nhất trong ngày, cập nhật liên tục 24h. Từ nguồn báo
            chính thống như CNN, BBC, VOA, Inside Science,...
          </p>

          {/* Big Article card */}

          <BigArticleCard />

          <div className="w-full flex justify-center rounded-xl shadow-md bg-white hover:shadow-lg border border-black/10 py-4">
            <Link className="block w-[95%] relative rounded-xl shadow-md text-white bg-black">
              <img
                src="https://admin.todaienglish.com/images/news/e0cc5e78378f260b9ef1332fa2b54c53.webp"
                alt="Main article"
                className="w-[80%] mx-auto h-[400px] object-cover"
              />
              <div className="absolute bottom-0 h-40 rounded-xl bg-gradient-to-t from-black/60 to-black/30 p-5">
                <h2 className="text-white text-3xl font-extrabold z-10 leading-12">
                  Nvidia commits $1M in AI scholarships to Vietnamese students
                </h2>
                <div className="mt-1">Todaii ddd</div>
                <></>
              </div>
            </Link>
          </div>

          {/* Articles Card*/}


          <div className="grid grid-cols-5 gap-3 mt-4">
            <div className="relative rounded-xl h-53 overflow-hidden shadow-sm bg-white hover:shadow-lg transition">
              <img
                src="https://admin.todaienglish.com/images/news/e0cc5e78378f260b9ef1332fa2b54c53.webp"
                alt=""
                className="w-full h-24 object-cover"
              />

              <div className="absolute h-6 top-18 border border-gray-400/10 text-[10px] rounded-r-sm  bg-[#f7f7f7] px-1">
                <p className="relative top-1">TODAII</p>
              </div>
              <div className="p-2 bg-white">
                <p className="mt-1 text-[13px] text-gray-700 line-clamp-3">
                  Nvidia commits $1M in AI scholarships to Vietnamese students
                </p>

                <p className="mt-3 text-[13px] text-gray-500">dd/mm/yyyy</p>
              </div>
            </div>
            
          </div>
        </div>
        {/* RIGHT SIDE */}

        <div className="w-55"></div>
      </div>
    </div>
  );
};

export default Home;
