import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { config } from "../config";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  useEffect(() => {
    // Disable pinning on mobile to allow scrolling
    if (window.innerWidth <= 768) return;

    const section = document.querySelector(".work-section") as HTMLElement;
    const flex = document.querySelector(".work-flex") as HTMLElement;
    if (!section || !flex) return;

    let timeline: gsap.core.Timeline;

    const getTranslateX = () => {
      const boxes = flex.querySelectorAll(".work-box");
      if (boxes.length === 0) return 0;

      const sectionRect = section.getBoundingClientRect();
      const lastBox = boxes[boxes.length - 1] as HTMLElement;
      const lastBoxRect = lastBox.getBoundingClientRect();
      const currentX = Number(gsap.getProperty(flex, "x")) || 0;
      const paddingRight = parseFloat(getComputedStyle(flex).paddingRight) || 0;
      const naturalRight = lastBoxRect.right - currentX;

      return Math.max(0, naturalRight - sectionRect.right + paddingRight);
    };

    const setupScroll = () => {
      timeline?.kill();
      ScrollTrigger.getById("work")?.kill();

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getTranslateX()}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          id: "work",
          invalidateOnRefresh: true,
        },
      });

      timeline.to(flex, {
        x: () => -getTranslateX(),
        ease: "none",
      });
    };

    setupScroll();

    const handleResize = () => {
      if (window.innerWidth <= 768) return;
      setupScroll();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    const refreshTimer = window.setTimeout(() => {
      setupScroll();
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(refreshTimer);
      timeline?.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {config.projects.slice(0, 5).map((project, index) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.technologies}</p>
              </div>
              <WorkImage
                image={project.image}
                images={project.images}
                alt={project.title}
                link={project.link}
              />
            </div>
          ))}
          {/* See All Works Button */}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                See All Works →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
