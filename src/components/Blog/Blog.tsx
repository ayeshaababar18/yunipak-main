// src/components/Blog/Blog.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../AnimatedBackground";
import { galleryImages } from "../../constants/yunityData";
import ImageWithSkeleton from "../ImageWithSkeleton";

const Blog: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="events-premium-section">
      <AnimatedBackground />
      <div className="yunity-blog-detail-view animate-fade-in-up">
        <div className="blog-detail-container-premium">
          <button onClick={() => navigate("/events")} className="back-btn-tech">
            <span className="arrow">←</span> BACK TO INTEL
          </button>

          <header className="blog-detail-header">
            <span className="blog-category-badge-premium" style={{ background: 'var(--pk-green)' }}>
              <span className="badge-icon">📷</span>
              <span className="badge-text">Summit Behind-the-Scenes</span>
            </span>
            <h1 className="blog-detail-title">
              Through the Viewfinder: <span className="text-gradient">48 Hours of Chaos, Caffeine, and Creative Spark at YUNIty</span>
            </h1>
            <div className="blog-detail-meta">
              <span className="meta-author">By the Camera Guy</span>
              <span className="meta-separator">/</span>
              <span className="meta-date">May 18, 2026</span>
              <span className="meta-separator">/</span>
              <span className="meta-readtime">8 min read</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="blog-detail-featured-image">
            <ImageWithSkeleton src="/gallery/_DSC2342.jpg" alt="YUNIty Event Viewfinder" />
            <div className="scanline-overlay"></div>
            <div className="image-vignette"></div>
          </div>

          {/* Article Body */}
          <div className="blog-detail-body">
            <div className="blog-day-section">
              <h2 className="day-title"><span className="text-gradient">DAY 1</span> : Saturday, May 16th</h2>
              <h3 className="section-subtitle">08:00 AM — Morning Setup Chaos</h3>
              <p>
                Fingers were freezing, making it a pain to dial in the exposure. By 8 AM, the lobby was a total madhouse—less tech summit, more like a logistics warehouse gone wild. Tripod bags, slider cases, and loose batteries were piled up by the doors. The YUNIty crew was running around with walkie-talkies, taping down thick power lines with rolls of gaffer tape, while volunteers in slightly oversized t-shirts tried to sort out the registration spreadsheets.
              </p>
              <p>
                I grabbed my camera. Through the viewfinder, the lobby was just a blur of high-contrast motion. I spun the focus ring, catching a volunteer trying to balance a stack of lanyards while taking a desperate sip of black coffee. *Click.* Frame one: the raw, tired, caffeine-fueled start of Day 1.
              </p>

              <div className="blog-image-wrapper">
                <ImageWithSkeleton src="/gallery/_DSC2165.jpg" alt="Volunteers setting up the event space" />
                <span className="image-caption">Frame #01: Morning rush and setup.</span>
              </div>

              <h3 className="section-subtitle">10:00 AM — Main Stage Kickoff</h3>
              <p>
                By 10, the vibe completely shifted. The setup noise settled into a low, excited buzz inside the main hall. When the stage lights kicked on and the opening slides hit the screen, I was already huddled in the corner, kneeling on the hard concrete with my 70-200mm lens ready to go.
              </p>
              <p>
                The workshops started without warning. Luckily, these weren't those dry corporate presentations where the speaker reads bullet points. The speakers were walking the stage, gesture-heavy, getting right in the crowd's face. I tracked the front rows: rows of students leaning in, laptops casting a cool glow on their faces, furiously copying down code blocks and system diagrams. Every time a new concept dropped, you could hear the collective rustle of notebooks and rapid typing—it was like a satisfying background track.
              </p>

              <div className="blog-image-wrapper">
                <ImageWithSkeleton src="/gallery/_DSC2172.jpg" alt="Students focused on their screens during the workshop" />
                <span className="image-caption">Frame #02: Focus and ambient glow during workshops.</span>
              </div>

              <h3 className="section-subtitle">The Beanbag Sanctuary</h3>
              <p>
                Right outside the main hall was the ultimate chill spot: the waiting area. If you wanted to see what YUNIty was actually about, this was the place. My favorite shots of the day came from this little sunlit nook, which was basically just a pile of beanbags, empty cans, and laptops balanced on knees.
              </p>
              <p>
                I swapped to a wide 24mm lens to capture the chaos. People who were complete strangers two hours ago were sitting shoulder-to-shoulder on the floor, debating IDE themes, compiler errors, and where to get the best wings in town. No corporate hierarchy, no egos—just mentors in hoodies sitting on the floor with nervous freshmen, laughing over database horror stories.
              </p>

              <div className="blog-image-wrapper">
                <ImageWithSkeleton src="/gallery/_DSC2198.jpg" alt="Attendees collaborating in the waiting booth" />
                <span className="image-caption">Frame #03: Casual networking and team banter.</span>
              </div>

              <h3 className="section-subtitle">Late Afternoon — Whiteboards & Pressure</h3>
              <p>
                When the afternoon sun started hitting the windows, the mood turned serious. The pitching challenge was announced, and the room split into messy working groups. The whiteboards came out in force.
              </p>
              <p>
                You could practically feel the stress in the air. I walked slow through the rows, trying to shoot silently. I got shots of marker ink on glass, fingers flying on keyboards, and foreheads creased in deep concentration. Groups huddled around laptops in circles on the floor like campfires. They had to condense complex tech stacks into a three-minute pitch, and the time limit was definitely getting to them. No tech-glamour here—just raw, gritty teamwork.
              </p>

              <div className="blog-image-wrapper">
                <ImageWithSkeleton src="/gallery/_DSC2210.jpg" alt="Teammates hashing out ideas on a whiteboard" />
                <span className="image-caption">Frame #04: Distilling systems under time pressure.</span>
              </div>

              <h3 className="section-subtitle">Late Night Coding & Dev Check-in</h3>
              <p>
                By midnight, the place went quiet, but the core YUNIty crew was still in the main hub, buried in lines of code, terminal outputs, and late-night system architecture debates. Exhaustion was hitting hard, but the focus was absolute.
              </p>
              <p>
                We gathered around the central workstation to run a quick sprint sanity check. The ambient blue glow from the screens lit up the tired, determined faces of our lead engineers. I cranked my ISO to 6400 and opened the aperture wide, capturing the quiet intensity of the team working through complex compiler logs and database integrations.
              </p>

              <div className="blog-image-wrapper">
                <ImageWithSkeleton src="/gallery/_DSC2263.jpg" alt="YUNIty core crew late night coding check-in" />
                <span className="image-caption">Frame #05: Late night dev check-in and technical troubleshooting.</span>
              </div>
            </div>

            <hr className="blog-divider" />

            <div className="blog-day-section">
              <h2 className="day-title"><span className="text-gradient">DAY 2</span> : Sunday, May 17th</h2>

              <h3 className="section-subtitle">09:00 AM — The Second Wind</h3>
              <p>
                Sunday morning felt heavy. My camera bag felt three times heavier than yesterday. People stumbled in slowly, bloodshot eyes, holding paper cups of hot chai. We were running on fumes, but everyone knew Day 2 was the final stretch.
              </p>
              <p>
                I stood by the entrance, shooting arrivals: people rubbing their eyes, yawning, but still throwing a tired peace sign at the camera. Wiped down the lenses, cleared the SD cards, popped in fresh batteries, and we were back in action.
              </p>

              <div className="blog-image-wrapper">
                <ImageWithSkeleton src="/gallery/_DSC2383.jpg" alt="Sunrise coffee cups and morning arrivals" />
                <span className="image-caption">Frame #06: Coffee first, compile later.</span>
              </div>

              <h3 className="section-subtitle">The Morning Wake-up Call</h3>
              <p>
                Any remaining sleepiness evaporated the second Moiz grabbed the mic. Seriously, I don't know what caffeine he was on, but the energy was wild. In five minutes flat, he had everyone out of their chairs doing ridiculous physical icebreakers to wake up.
              </p>
              <p>
                I ran along the walls, trying to shoot the madness. The hall was a wall of noise—laughing, shouting, doing bizarre hand signs. Got some great shots of genuine, unpolished smiles: people cracking up, pointing at each other, and high-fiving. The ice didn't just break; it shattered.
              </p>

              <div className="blog-image-wrapper">
                <ImageWithSkeleton src="/gallery/_DSC2344.jpg" alt="Students high fiving and laughing in icebreaker" />
                <span className="image-caption">Frame #07: Hype circles and morning energy.</span>
              </div>

              <h3 className="section-subtitle">Fueling Up</h3>
              <p>
                Then, lunchtime—the best part. A huge spread of hot food, snacks, and cold drinks showed up, and all the intense coding focus vanished into a noisy lunch chat.
              </p>
              <p>
                I snapped shots of plates piled dangerously high, guys leaning against columns talking with their hands, and teams posing with their custom flags. It was the complete opposite of the quiet workspaces—loud, warm, smelling of spices and fresh mint mocktails.
              </p>

              <div className="blog-image-wrapper">
                <ImageWithSkeleton src="/gallery/_DSC2227.jpg" alt="A spread of snacks and tea at the refreshment break" />
                <span className="image-caption">Frame #08: Lunch breaks and team syncs.</span>
              </div>

              <h3 className="section-subtitle">Candid Snaps & Shared Energy</h3>
              <p>
                A huge part of the summit was the raw, unscripted energy of the participants. I spent a lot of time pacing the floor, waiting for the moments when people forgot the camera was there—the moments of intense focus, the bursts of laughter during keynotes, and the excitement of the final presentations.
              </p>
              <p>
                I kept the shutter speed fast, capturing the split-second reactions. Whether it was the tension of waiting for results, the joy of a successful presentation, or the ambient buzz of the main hall, these frames caught the real pulse of YUNIty.
              </p>

              {/* Collage Section */}
              <div className="drink-collage-grid">
                <div className="collage-card"><ImageWithSkeleton src="/gallery/thumbs/_DSC2219.jpg" alt="Candid crowd reaction" /></div>
                <div className="collage-card"><ImageWithSkeleton src="/gallery/thumbs/_DSC2432.jpg" alt="Award ceremony reaction" /></div>
                <div className="collage-card"><ImageWithSkeleton src="/gallery/thumbs/_DSC2377.jpg" alt="Keynote session energy" /></div>
                <div className="collage-card"><ImageWithSkeleton src="/gallery/thumbs/_DSC2604.jpg" alt="Closing ceremony celebration" /></div>
              </div>
              <span className="image-caption text-center">Frame #09: Captured expressions, laughter, and high energy.</span>

              <div className="gallery-cta-card card-glow-border">
                <div className="gallery-cta-content">
                  <h3>YUNIty 2026 Interactive Memory Cloud</h3>
                  <p>Step into our fully interactive, high-fidelity visual archive. Hover to focus, zoom, and explore the raw frames of the weekend.</p>
                  
                  {/* Gallery Glimpse Preview Grid */}
                  <div className="gallery-glimpse-grid">
                    {galleryImages.slice(0, 6).map((img) => (
                      <div key={img.id} className="glimpse-thumbnail" onClick={() => navigate("/gallery")}>
                        <ImageWithSkeleton src={img.src.replace("/gallery/", "/gallery/thumbs/")} alt={img.alt} />
                        <div className="glimpse-overlay">
                          <span className="plus">+</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => navigate("/gallery")} className="read-more-btn-tech" style={{ margin: '0 auto' }}>
                    Launch Memory Cloud <span className="arrow">→</span>
                  </button>
                </div>
              </div>

              <h3 className="section-subtitle" style={{ marginTop: '5rem' }}>The Post-Event Collapse</h3>
              <p>
                Once the pitches were done, winners announced, and the crowd went home, the venue suddenly went dead silent. Just the YUNIty crew and volunteers left. We didn't pack up right away. We just collapsed on the cool lobby floor, leaning against the pillars.
              </p>
              <p>
                I set my camera on a gear bag, threw on a wide lens, and set the self-timer to join the shot. No posed smiles here—just slouched shoulders, messy hair, and genuine smiles of relief. We sat in a circle around the gear, recounting the absolute chaos of the last 48 hours. For me, that was the realest photo of the whole event: a completely exhausted team, tight-knit, sharing the quiet after the storm.
              </p>

              <div className="blog-image-wrapper">
                <ImageWithSkeleton src="/gallery/_DSC2447.jpg" alt="The YUNIty core team sitting on the floor smiling" />
                <span className="image-caption">Frame #10: The final group wrap-up and smiles of relief.</span>
              </div>
            </div>
          </div>

          <button onClick={() => navigate("/events")} className="back-btn-tech bottom-back">
            ← BACK TO INTEL
          </button>
        </div>
      </div>

      <style>{`
        .events-premium-section {
          min-height: 100vh;
          background: transparent;
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
          padding-top: 100px;
          position: relative;
        }

        .yunity-blog-detail-view {
          padding: 2rem 0;
          color: var(--text-primary);
        }

        .blog-detail-container-premium {
          max-width: 54rem;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 10;
        }

        .back-btn-tech {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          padding: 0.8rem 1.6rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 3rem;
        }

        .back-btn-tech:hover {
          border-color: var(--pk-green);
          color: var(--pk-green);
          background: var(--pk-green-glow-subtle);
          transform: translateX(-4px);
        }

        .back-btn-tech.bottom-back {
          margin-top: 4rem;
          margin-bottom: 0;
        }

        .blog-detail-header {
          margin-bottom: 3rem;
        }

        .blog-detail-title {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1.2;
          margin: 1.5rem 0;
          letter-spacing: -0.02em;
        }

        .blog-detail-meta {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.85rem;
          color: var(--text-tertiary);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-separator {
          color: rgba(255, 255, 255, 0.15);
        }

        .blog-detail-featured-image {
          position: relative;
          width: 100%;
          height: 480px;
          border-radius: 2rem;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          margin-bottom: 4rem;
        }

        .blog-detail-featured-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .blog-detail-body {
          font-size: 1.15rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .blog-day-section {
          margin-bottom: 4rem;
        }

        .day-title {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-top: 3rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .section-subtitle {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }

        .blog-image-wrapper {
          position: relative;
          width: 100%;
          margin: 2.5rem 0;
          border-radius: 1.5rem;
          overflow: hidden;
          border: 1px solid var(--glass-border);
        }

        .blog-image-wrapper img {
          width: 100%;
          height: auto;
          display: block;
          filter: brightness(0.95);
        }

        .image-caption {
          display: block;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-tertiary);
          margin-top: 1rem;
          font-style: italic;
        }

        .blog-divider {
          border: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--glass-border), transparent);
          margin: 4rem 0;
        }

        .drink-collage-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin: 2.5rem 0 1rem;
        }

        .collage-card {
          aspect-ratio: 1;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.4s ease;
        }

        .collage-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(20%) contrast(1.05);
          transition: all 0.4s ease;
        }

        .collage-card:hover {
          transform: translateY(-5px) scale(1.05);
          border-color: var(--pk-green);
          box-shadow: 0 10px 25px var(--pk-green-glow);
        }

        .collage-card:hover img {
          filter: grayscale(0%) contrast(1.1);
        }

        .gallery-cta-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          border-radius: 1.5rem;
          padding: 2.5rem;
          margin: 5rem 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .gallery-cta-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, var(--pk-green-glow-subtle) 0%, transparent 60%);
          pointer-events: none;
        }

        .gallery-cta-content h3 {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .gallery-cta-content p {
          color: var(--text-secondary);
          margin-bottom: 1.8rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .read-more-btn-tech {
          background: transparent;
          border: 1px solid var(--pk-green);
          color: var(--pk-green);
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .read-more-btn-tech:hover {
          background: var(--pk-green);
          color: #000;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px var(--pk-green-glow);
        }

        .blog-category-badge-premium {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #000;
        }

        .scanline-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
          background-size: 100% 4px;
          z-index: 2;
          pointer-events: none;
        }

        .image-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.4) 100%);
          z-index: 1;
          pointer-events: none;
        }

        .gallery-glimpse-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.8rem;
          margin: 2rem 0;
          width: 100%;
        }

        .glimpse-thumbnail {
          aspect-ratio: 1.5;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border-light);
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .glimpse-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .glimpse-overlay {
          position: absolute;
          inset: 0;
          background: rgba(12, 98, 56, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .glimpse-overlay .plus {
          color: #000;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .glimpse-thumbnail:hover {
          transform: translateY(-2px);
          border-color: var(--pk-green);
          box-shadow: 0 4px 12px var(--pk-green-glow);
        }

        .glimpse-thumbnail:hover img {
          transform: scale(1.1);
        }

        .glimpse-thumbnail:hover .glimpse-overlay {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .blog-detail-title {
            font-size: 2rem;
          }
          .blog-detail-featured-image {
            height: 300px;
          }
          .drink-collage-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.8rem;
          }
          .gallery-glimpse-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
            margin: 1.5rem 0;
          }
        }
      `}</style>
    </section>
  );
};

export default Blog;
