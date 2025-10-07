import React from 'react'

const CourseBox = ({course}) => {
  return (
    <div className="relative w-87 h-80 min-[850px]:max-lg:w-85 max-[850px]:w-full max-[360px]:h-90 bg-white rounded-xl shadow-md">
        <div className="relative left-5 -top-5">
            <img src={course.icon} alt={`${course.title} icon`} />
        </div>

        <div className="pt-4 pl-7">
            <h3 className="text-2xl font-extrabold text-[#13183f] mb-6">{course.title}</h3>
            <p className= "max-[850px]:w-[70%] w-[90%] text-[#83869a] font-medium text-lg leading-7">{course.desc}</p>
            <a href="#" className="absolute bottom-[10%] text-pink-500 font-bold text-lg">
                Get Started
            </a>
        </div>
    </div>
  )
}

export default CourseBox