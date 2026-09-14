import Link from "next/link";
import GuideLayout, { GuideH2, guideMetadata, GUIDE_TITLES } from "@/components/GuideLayout";

export const metadata = guideMetadata("common-youtube-seo-mistakes");
const META = GUIDE_TITLES["common-youtube-seo-mistakes"];

export default function Article() {
  return (
    <GuideLayout
      slug="common-youtube-seo-mistakes"
      title={META.title}
      intro="Most of the everyday things that quietly hold videos back are not dramatic failures — they are small, repeated habits. Here are the mistakes we see most, and the fix for each."
      updated={META.updated}
      relatedSlugs={[
        "youtube-seo-for-beginners",
        "how-to-write-a-youtube-description",
        "how-youtube-tags-work",
      ]}
    >
      <p>
        Very little about YouTube SEO is mysterious. What separates videos that
        perform well from ones that don't is often a small set of consistent
        habits. The mistakes below are the ones creators repeat most — not hard
        to fix, but easy to miss. Fixing even a few of them tends to move
        performance more than any single clever trick.
      </p>

      <GuideH2>Ignoring what people actually search for</GuideH2>
      <p>
        The most common and most costly mistake is making a video about what
        you want to say while ignoring whether anyone is searching for it. A
        beautiful video about a topic nobody types will simply not be found. The
        fix is seconds of research: type your topic into YouTube, read the
        autocomplete suggestions, and check the related searches. If there is
        clear demand, shape your title and description around that phrasing. See
        the{" "}
        <Link
          href="/guides/how-to-find-youtube-keywords"
          className="underline hover:text-neutral-900"
        >
          keyword research guide
        </Link>{" "}
        for the full method.
      </p>

      <GuideH2>A weak, vague title</GuideH2>
      <p>
        "Editing tips", "My new setup", "Part 2" — titles like these tell a
        viewer nothing about why to click and tell YouTube little about your
        topic. The fix is to state the topic clearly plus the specific value,
        using real search language. "3 Editing Tips That Instantly Make Your
        Videos Look Cleaner" beats "Editing tips" in both clarity and search
        signal. Go through the title after you finish the video and make sure
        it genuinely describes it.
      </p>

      <GuideH2>Copy-pasting the same description onto every video</GuideH2>
      <p>
        Reusing one generic description is tempting for speed, but it tells
        YouTube nothing about the specific video and tells the viewer even less.
        Each upload deserves its own few lines summarising what that video
        covers and its real value. You do not need hundreds of words — you need a
        specific, honest summary with a keyword used naturally. The{" "}
        <Link
          href="/guides/how-to-write-a-youtube-description"
          className="underline hover:text-neutral-900"
        >
          description guide
        </Link>{" "}
        gives a structure that takes minutes.
      </p>

      <GuideH2>Relying on tags as the main optimization</GuideH2>
      <p>
        Many creators pour their effort into the tag field while leaving titles
        and descriptions thin — exactly backwards. Tags are a minor signal;
        titles and descriptions carry far more weight. The fix is to sequence
        your effort: make sure the title is clear and the description summarises
        the video, then add a sensible, relevant tag set as the last step, not
        the centrepiece. The{" "}
        <Link
          href="/guides/how-youtube-tags-work"
          className="underline hover:text-neutral-900"
        >
          tags guide
        </Link>{" "}
        explains how much (or how little) they matter.
      </p>

      <GuideH2>Keyword stuffing</GuideH2>
      <p>
        Repeating a phrase until the title or description reads unnaturally is a
        reflexive habit from the old days of web SEO. On YouTube it reads as
        spam to viewers and adds nothing for search, because the systems have
        long been good enough to judge relevance on their own. Use the keyword
        once, clearly, in a natural sentence, and add related phrases where they
        fit. Honesty and clarity beat density every time.
      </p>

      <GuideH2>Titles and thumbnails that over-promise</GuideH2>
      <p>
        A title or thumbnail that promises something the video does not deliver
        earns the click and loses the view. When viewers leave quickly, your
        average percentage viewed drops and YouTube stops recommending the video
        to the people who would have genuinely enjoyed it. It is the least
        sustainable optimization there is. Keep the packaging accurate, then
        make the opening deliver on it fast. The{" "}
        <Link
          href="/guides/how-to-improve-youtube-click-through-rate"
          className="underline hover:text-neutral-900"
        >
          click-through guide
        </Link>{" "}
        covers this trade-off in detail.
      </p>

      <GuideH2>A weak opening that squanders clicks</GuideH2>
      <p>
        Getting the click is only the first half. If the first minutes are
        intro, logos, and throat-clearing, viewers who might have stayed leave,
        and the video underperforms despite good packaging. The fix: confirm the
        promise from the title within seconds, deliver value early, and front-load
        whatever is most interesting. Chapters also help viewers find the part
        they came for, which lifts the average percentage viewed.
      </p>

      <GuideH2>Judging performance from one number</GuideH2>
      <p>
        A creator sees a modest CTR or a low view count on one video and
        changes everything — when the real problem was sample size, or the
        wrong metric. Single videos are noisy; small channels especially see
        wide swings. The fix is to read CTR and average percentage viewed
        together, across several similar videos, over a few weeks. Optimise
        based on a pattern, not a panic.
      </p>

      <GuideH2>Ignoring old videos that are close to working</GuideH2>
      <p>
        Many channels pour all their energy into the next upload and never touch
        older videos that are almost ranking — an update to the title or
        description, or a change of thumbnail, can revive genuinely valuable
        content with little effort.{" "}
        <Link
          href="/guides/how-to-optimize-an-old-youtube-video"
          className="underline hover:text-neutral-900"
        >
          The guide on optimizing old videos
        </Link>{" "}
        walks through the exact refresh process.
      </p>

      <GuideH2>Bottom line</GuideH2>
      <p>
        The common mistakes share one theme: they optimise for the appearance of
        search effort — tags, word counts, sensational packaging — instead of for
        honest clarity and real viewer satisfaction. Match your topic to real
        demand, describe it clearly, and make sure people who click stay. Do
        that consistently and you will have avoided most of what holds channels
        back.
      </p>
    </GuideLayout>
  );
}