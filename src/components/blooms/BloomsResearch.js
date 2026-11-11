import React from "react";
import Section from "../general/Section";
import Card from "../general/Card";
import TextStack from "../general/TextStack";

function BloomsResearch() {
  return (
    <Section tagText="Research" project="blooms">
      <div className="flex flex-col gap-xs">
        <Card className="border-b-[1px]">
          <span className="font-mono tracking-normal text-text-subtle">
            Insight 1
          </span>
          <TextStack header="A lack of social support causes feelings of guilt and shame in women.">
            <p>
              The social stigma surrounding abortion care is often perpetrated
              by family, partners, and even self. Kimberly says this is the
              second biggest barrier to women receiving abortion car, after
              logistical issues. Women need not only logistic support, but also
              a social support system.
            </p>
          </TextStack>
        </Card>
        <Card className="border-b-[1px]">
          <span className="font-mono tracking-normal text-text-subtle">
            Insight 2
          </span>
          <TextStack header="Social and environmental determinants affect health outcomes.">
            <p>
              Social support systems, including family and community networks,
              influence decision-making and emotional well-being during
              challenging times. Stigmas and cultural beliefs about abortion can
              limit access to care and the willingness to seek help.
            </p>
          </TextStack>
        </Card>
        <Card>
          <span className="font-mono tracking-normal text-text-subtle">
            Insight 3
          </span>
          <TextStack header="Logistical difficulties involved getting an abortion cause stress that result in negative mental health outcomes.">
            <p>
              Logistical issues include expenses (of the abortion itself,
              lodging, and transportation) and the need to travel out of state
              for women in states where abortion is banned. Women who need to
              travel also need to arrange to miss work, find childcare, and find
              lodging. Additionally, lack of accessible information about
              clinics, appointment availability, insurance and state-by-state
              waiting periods and gestational limits delay women in obtaining
              care. The longer the delay, the more expensive and medically risky
              the procedure becomes.
            </p>
          </TextStack>
        </Card>
      </div>

      {/* <p className="font-bold">Kimberly Piontkowski</p>
      <p>
        Brown University MPH '23 + Healthcare Assistant @ Planned Parenthood
        League of Massachusetts
      </p>
      <p className="font-bold">Jenna Jerman et. al</p>
      <p>
        "Barriers to Abortion Care and Their Consequences"{" "}
        <i>Perspectives on sexual and reproductive health</i> vol. 49,2 (2017):
        95-102. doi:10.1363/psrh.12024
      </p>
      <p className="font-bold">Spencer Kimball</p>
      <p>
        "Women in states that ban abortion will still be able to get abortion
        pills online" CNBC Health and Science. 27 Jun, 2022.
      </p> */}
      <img
        src="https://images.claireguo.com/blooms/affinitymap.png"
        alt="Affinity map"
      />
    </Section>
  );
}

export default BloomsResearch;
