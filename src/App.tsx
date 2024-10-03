import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import Lottie from "lottie-react";
import congrats from "./assets/congrats.json";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineCalculate } from "react-icons/md";
import { RiApps2AddLine } from "react-icons/ri";
import { BsHeartArrow, BsHearts } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";

// Define Course interface
interface Course {
  units: string;
  grade: string;
}

Modal.setAppElement("#root");

const App = () => {
  const [courses, setCourses] = useState<Course[]>([{ units: "", grade: "" }]);
  const [gpa, setGpa] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cheer, setCheer] = useState(false);
  const [gpaMessage, setGpaMessage] = useState("");

  const handleAddCourse = () => {
    setCourses([...courses, { units: "", grade: "" }]);
  };

  const handleInputChange = (
    index: number,
    field: keyof Course,
    value: string
  ) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const handleDeleteCourse = (index: number) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  const handleCourseCount = (count: number) => {
    const initialCourses = Array.from({ length: count }, () => ({
      units: "",
      grade: "",
    }));
    setCourses(initialCourses);
    setShowInput(false); // Hide input after setting the number of courses
  };

  const isFormComplete = () => {
    return courses.every(
      (course) => course.units !== "" && course.grade !== ""
    );
  };

  const calculateGPA = () => {
    setLoading(true);
    if (!isFormComplete()) {
      toast.error(
        "Please fill in all course units and grades before calculating GPA!"
      );
      return;
    }

    let totalUnits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      const units = parseFloat(course.units);
      const grade = course.grade.toUpperCase();

      const gradeValue =
        grade === "A"
          ? 5
          : grade === "B"
          ? 4
          : grade === "C"
          ? 3
          : grade === "D"
          ? 2
          : grade === "E"
          ? 1
          : 0;

      totalUnits += units;
      totalPoints += units * gradeValue;
    });

    const calculatedGpa = (totalPoints / totalUnits).toFixed(2);
    setGpa(calculatedGpa);

    const gpaValue = parseFloat(calculatedGpa);

    if (gpaValue >= 4.5) {
      setGpaMessage("Congratulations! You are the GOAT. First Class!");
      setCheer(true);
    } else if (gpaValue >= 4.0 && gpaValue < 4.5) {
      setGpaMessage(
        "Great job! You earned a Second Class Upper. You sef no small o"
      );
      setCheer(false);
    } else if (gpaValue >= 3.5 && gpaValue < 4.0) {
      setGpaMessage(
        "Well done! You earned a Second Class Lower. You sef don try oga mi"
      );
      setCheer(false);
    } else if (gpaValue >= 3.0 && gpaValue < 3.5) {
      setGpaMessage(
        "Good effort! You earned a Third Class. You can do better blud"
      );
      setCheer(false);
    } else {
      setGpaMessage(
        "You passed, keep working hard! NO GIVE UP, NA MUMU DEY GIVE UP"
      );
      setCheer(false);
    }

    setLoading(false);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          GPA Calculator
        </h1>

        {/* Only show this input once at the beginning */}
        {showInput && (
          <div className="mb-4">
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              placeholder="How many courses do you have?"
              onChange={(e) => handleCourseCount(Number(e.target.value))}
            />
          </div>
        )}

        {courses.map((course, index) => (
          <motion.div
            key={index}
            className="flex mb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <input
              type="number"
              value={course.units}
              onChange={(e) =>
                handleInputChange(index, "units", e.target.value)
              }
              className="w-1/2 mr-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Course Units"
              onWheel={(e) => (e.target as HTMLInputElement).blur()} // Remove number input arrows
            />
            <select
              value={course.grade}
              onChange={(e) =>
                handleInputChange(index, "grade", e.target.value)
              }
              className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
            </select>
            <button onClick={() => handleDeleteCourse(index)} className="ml-2">
              <FaXmark color="red" />
            </button>
          </motion.div>
        ))}

        <motion.button
          onClick={handleAddCourse}
          className="w-full bg-blue-600 text-white p-2 flex items-center justify-center gap-5 group rounded-md mt-2 hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Another Course
          <RiApps2AddLine
            size={24}
            className="text-blue-100 group-hover:animate-spin"
          />
        </motion.button>

        <motion.button
          onClick={calculateGPA}
          className={`w-full bg-green-600 group text-white flex items-center justify-center gap-5 p-2 mt-4 rounded-md hover:bg-green-700 ${
            !isFormComplete() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!isFormComplete()}
        >
          {loading ? "Calculating..." : "Calculate GPA"}{" "}
          <MdOutlineCalculate
            size={24}
            className="text-green-100 group-hover:animate-spin "
          />
        </motion.button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="modal "
          overlayClassName="modal-overlay"
        >
          {cheer && (
            <motion.div
              className="absolute inset-0 -top-32 h-[100vh] flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Lottie animationData={congrats} loop={2} />
            </motion.div>
          )}
          <div className="bg-white p-6 rounded-md text-center shadow-lg">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4">Your GPA is:</h2>
                <motion.div
                  className="text-4xl font-bold text-green-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {gpa}
                </motion.div>
                <p className="mt-4 font-bold text-lg">{gpaMessage}</p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-8 absolute -ml-10 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </Modal>

        <ToastContainer />
      </motion.div>
      <div className="mt-12 flex items-center justify-center flex-col">
        <p className="text-lime-600 flex items-center justify-center gap-2">
          Made by <BsHearts size={20} className="text-pink-500" />
        </p>
        <div className="">
          <a
            href="https://code-with-toyin.vercel.app/"
            target="_blank"
            className="text-lime-400 flex items-center justify-center gap-2"
          >
            <BsHeartArrow />
            code with toyin
            <BsHeartArrow className="rotate-180" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
