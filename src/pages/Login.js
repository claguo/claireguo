import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Button from "../components/general/Button";
import Clicksplosion from "../components/custom/Clicksplosion";
import { IoArrowForwardSharp, IoArrowBackSharp } from "react-icons/io5";

function Login() {
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const PASSWORD_COOKIE_NAME = "password";

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/2026";

  useEffect(() => {
    const savedPassword = Cookies.get(PASSWORD_COOKIE_NAME);
    if (savedPassword === "amphibian") {
      navigate(from, { replace: true });
    }
  }, [from, navigate]);

  const handleLogin = () => {
    if (password === "amphibian") {
      Cookies.set(PASSWORD_COOKIE_NAME, password, {
        expires: 1,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      navigate(from, { replace: true });
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <div className="p-3xs fixed w-screen h-screen bg-bg-gray flex flex-col">
      <Button
        variant="ghost"
        onClick={() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            navigate("/2026");
          }
        }}
      >
        <IoArrowBackSharp className="text-[20px]" />
      </Button>

      <div className="flex w-full lg:h-full py-4xl justify-center items-center">
        <input
          type={isHovered ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Password"
          size={password.length || 10}
          className="bg-transparent outline-none inline-block text-[16px] border-none font-mono inline-block caret-pink py-[0.5rem]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          autoFocus
        />
        {password !== "" && (
          <Clicksplosion>
            <Button onClick={handleLogin} variant="ghost">
              <IoArrowForwardSharp className="text-[16px]" />
            </Button>
          </Clicksplosion>
        )}
      </div>
    </div>
  );
}

export default Login;
