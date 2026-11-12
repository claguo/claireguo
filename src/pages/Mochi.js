import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import ContentWrapper from "../components/general/ContentWrapper";
import ProjectHero from "../components/ProjectHero";
import Section from "../components/general/Section";
import SecondaryPage from "../components/general/SecondaryPage";
import TLDR from "../components/mochi/TLDR";
import TextStack from "../components/general/TextStack";

function Mochi() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const password = Cookies.get("password");
    if (password !== "benny") {
      navigate("/login", {
        state: { from: location.pathname },
      });
    }
  }, [navigate, location]);

  return (
    <SecondaryPage>
      <ProjectHero />
      <ContentWrapper>
        <TLDR />
        <Section tagText="the system" project="mochi">
          <TextStack
            header="Color Tokens"
            className="font-mono tracking-normal text-text-subtle"
          >
            <p>
              Colors are logically named based on their usage. Each color token
              has 3 different values for Default/Premium/Pediatrics modes.
            </p>
            <img
              src="https://images.claireguo.com/mochi/system_color-tokens.png"
              alt="Background and accent color tokens"
              className="border-[1px] border-border-default rounded-[12px] object-cover"
            />
          </TextStack>
          <TextStack
            header="Components"
            className="font-mono tracking-normal text-text-subtle"
          >
            <div className="flex flex-col gap-xl">
              <img
                src="https://images.claireguo.com/mochi/system_button.png"
                alt="Button component"
                className="object-cover"
              />
              <img
                src="https://images.claireguo.com/mochi/system_textfield.png"
                alt="Text field component"
                className="object-cover"
              />
              <img
                src="https://images.claireguo.com/mochi/system_other.png"
                alt="Tab bar and action menu components"
                className="object-cover"
              />
            </div>
          </TextStack>
        </Section>
        <Section tagText="the system in use" project="mochi">
          <video className="rounded-md w-full" controls autoPlay muted loop>
            <source
              src="https://images.claireguo.com/mochi/video_mobile-app.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <span className="text-center -mt-sm lg:-mt-md text-xs lg:text-base text-text-subtle">
            (Wonderful amazing video by Michelle Dang!)
          </span>

          <img
            src="https://images.claireguo.com/mochi/in-use.png"
            alt="Bento Design System used in various app designs"
          />
        </Section>
      </ContentWrapper>
    </SecondaryPage>
  );
}

export default Mochi;
