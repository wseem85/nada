import React from 'react';
import SectionTitle from '../components/SectionTitle';
import styled from 'styled-components';
import { assets } from '../assets/assets';
const TitleMain = styled.div`
  color: #e5e5e5;
  font-size: 70%;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.3rem;
  margin-bottom: 1.3rem;
  @media screen and (min-width: 300px) {
    font-size: 90%;
  }

  @media screen and (min-width: 490px) {
    font-size: 100%;
  }
  & > section {
    height: 50px;
    overflow: hidden;
    margin-left: 2.3rem;
    & > div {
      height: 100%;
      color: #f3f4f6;
    }
    & > div > h2 {
      font-size: 2.5rem;
      font-weight: 500;
      letter-spacing: 2px;
      line-height: 1.4px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 1rem;
      padding-right: 1rem;
      color: #f3f4f6;
    }
    & > div > div {
      padding: 0.5rem 1rem;
      height: 100%;
      margin-bottom: 2.81rem;
      display: inline-block;
    }
    & > div:first-child {
      @keyframes text-animation {
        0% {
          margin-top: 0;
        }
        10% {
          margin-top: 0;
        }
        20% {
          margin-top: -3rem;
        }
        30% {
          margin-top: -3rem;
        }
        40% {
          margin-top: -6.2rem;
        }
        60% {
          margin-top: -6.2rem;
        }
        70% {
          margin-top: -3rem;
        }
        80% {
          margin-top: -3rem;
        }
        90% {
          margin-top: 0;
        }
        100% {
          margin-top: 0;
        }
      }

      animation: text-animation 8s infinite;
    }
    & > div > h2 {
      font-size: inherit;

      text-transform: uppercase;
    }
    & > div:first-child > h2 {
      background-color: #257180;
    }
    & > div:nth-child(2) > h2 {
      background-color: #2c1989;
    }
    & > div:nth-child(3) > h2 {
      background-color: #b17457;
    }
  }
  & > h1 {
    text-shadow: 0 0 7px rgba(255, 255, 255, 0.3),
      0 0 3px rgba(255, 255, 255, 0.3);
    color: #257180;
    font-size: inherit;
    font-weight: bold;
  }
`;

const AboutArtist = () => {
  return (
    <section className="mt-20  ">
      <SectionTitle title="About Me" />
      <TitleMain>
        <h1>Hello 👋 I am</h1>
        <section>
          <div>
            <h2>Nada</h2>
          </div>
          <div>
            <h2> An Artist</h2>
          </div>

          <div>
            <h2>A Painter</h2>
          </div>
        </section>
      </TitleMain>
      <div className="lg:flex gap-6 mt-10">
        <div>
          <img src={assets.about_1} alt="Picture of the artist" />
        </div>
        <div className="lg:max-w-[50%]">
          <div className=" mt-8 lg:mt-0 flex flex-col gap-4 ">
            <h3 className=" text-xl text-brand-dark font-medium tracking-wider uppercase">
              Who Am I ?
            </h3>

            <p align="left">
              I am an artist who believes that art is a language for truths that
              can't be spoken. As the great <b>Georgia O’Keeffe</b> once said,
              <br />
              <q className="italic text-lg font-medium">
                {' '}
                I found I could say things with color and shapes that I couldn't
                say any other way—things I had no words for.
              </q>{' '}
              <br />
              This sentiment guides my creative process, where I blend realism
              with abstraction to create portraits that are not just likenesses
              but windows into a subject's soul.
            </p>
            <p>
              {' '}
              I am captivated by the details, the subtle textures, and the
              stories they tell. However, I also believe that a work of art is
              more than the sum of its parts. As Georgia O'Keeffe also wisely
              stated,{' '}
              <q className="italic text-lg font-medium">
                {' '}
                Nothing is less real than realism. <br />
                Details are confusing. It is only by selection, by elimination,
                by emphasis, that we get at the real meaning of things.
              </q>
            </p>
          </div>
        </div>
      </div>
      <hr className="outline-none border-none bg-beige-light h-1 mt-10 " />
      <p className=" leading-relaxed text-lg font-medium py-6">
        My work is a continuous effort to find this meaning—to go beyond what is
        visible and reveal the deeper essence of a subject. Whether I am using
        the quiet strength of charcoal to capture an intense gaze or the vibrant
        energy of mixed media to show a metamorphosis of spirit, my goal remains
        the same: to create a world where every detail serves to express a
        larger, unspoken truth.
      </p>
      <hr className="outline-none border-none bg-beige-light h-1 mb-10 " />
      <div className="lg:flex gap-6 mt-10">
        <div className="lg:max-w-[50%]">
          <div className=" mt-8 lg:mt-0 flex flex-col gap-4 ">
            <h3 className="text-xl text-brand-dark font-medium tracking-wider uppercase">
              My Reality!
            </h3>
            <p align="left">
              I am the artist who sees a world of color and feeling, capturing
              it not just in what is seen, but what is felt. My work is not an
              escape from reality, but a way to express it in its rawest form. I
              am the artist who paints my own reality. As <b>Frida Kahlo</b>{' '}
              said, <br />
              <q className="italic text-lg font-medium">
                I don't paint dreams or nightmares, I paint my own reality.
              </q>
              <br />
              <br />
              I believe art has a purpose beyond a mere image. It is a way to
              heal, a way to make something whole again. I am the artist who
              lives by Louise Bourgeois's belief that <br />
              <q className="italic text-lg font-medium">
                Art is restoration: the idea is to repair the damages that are
                inflicted in life, to make something that is fragmented—which is
                what fear and anxiety do to a person—into something whole.
              </q>
              <br />
              <br />
              And yet, my work is also born from a simple need, a singular
              passion. I am the artist who knows that, as Yayoi Kusama put it,
              <q>The only thing I know is that I paint because I need to.</q>
            </p>
          </div>
        </div>
        <div className="mt-6 lg:mt-0">
          <img src={assets.about_2} alt="Picture of the artist" />
        </div>
      </div>
    </section>
  );
};

export default AboutArtist;
