import Link from "next/link";
import GuideLayout, { GuideH2, GuideH3, guideMetadata, GUIDE_TITLES } from "@/components/GuideLayout";

export const metadata = guideMetadata("youtube-seo-for-beginners");
const META = GUIDE_TITLES["youtube-seo-for-beginners"];

export default function Article() {
  return (
    <GuideLayout
      slug="youtube-seo-for-beginners"
      title={META.title}
      intro="Before you can improve the way your videos perform, it helps to understand the machine you are working with. Here is a plain-language look at how YouTube finds, ranks, and recommends videos — and what that means for a beginner."
      updated={META.updated}
      relatedSlugs={[
        "how-to-find-youtube-keywords",
        "how-to-write-better-youtube-titles",
        "how-to-optimize-an-old-youtube-video",
      ]}
    >
      <p>
        "YouTube SEO" sounds like a dark art, but it is really just helping
        YouTube understand what your video is about so it can show it to the
        right people. YouTube is not trying to rank videos the way Google ranks
        web pages; it is a recommendations system whose main job is to keep
        people watching. Knowing that changes how you think about every
        optimisation you do.
      </p>

      <GuideH2>How YouTube actually decides what to show</GuideH2>
      <p>
        Two systems matter for most creators. Search is when a viewer types a
        query and YouTube matches it to videos. Recommendation is when YouTube
        surfaces videos in the home feed and the "up next" sidebar. Search
        cares a lot about whether your video's title, description, and tags
        match the query. Recommendation cares more about behaviour — how often
        people who saw the video clicked it and, crucially, how long they
        stayed. This is why a video can get zero search traffic and still grow
        through recommendations, and why a great title that people click but
        quickly abandon can still fail.
      </p>

      <GuideH2>The one metric that pulls it all together</GuideH2>
      <p>
        Beginners are often told to chase views, but the more useful number is
        average percentage viewed — roughly, how long viewers stay relative to
        the video length. YouTube treats a high percentage viewed as a strong
        sign that the video is satisfying, so it is more likely to recommend
        it. The practical implication is enormous: a thirty-minute video the
        average viewer watches halfway can outperform a two-minute video the
        average viewer watches a third of, because it keeps people engaged for
        longer. Optimising for "did viewers stay?" is the healthiest goal a
        beginner can adopt.
      </p>

      <GuideH2>The essentials, in order of importance</GuideH2>
      <GuideH3>Make a video worth watching</GuideH3>
      <p>
        Everything else is decoration if the video does not hold attention.
        Strong opening, clear structure, editing that keeps things moving.
        SEO can get a video in front of people; only the video can keep them
        there. No amount of titles, tags, or descriptions fixes a video people
        click and abandon.
      </p>
      <GuideH3>Match the topic to real search terms</GuideH3>
      <p>
        Before making or publishing, decide which words a viewer would type to
        find your video. Work from phrases people actually use — the{" "}
        <Link
          href="/guides/how-to-find-youtube-keywords"
          className="underline hover:text-neutral-900"
        >
          keyword research guide
        </Link>{" "}
        shows the exact process. This single decision shapes your
        title, description, and tags and keeps all three pulling in the same
        direction.
      </p>
      <GuideH3>Title</GuideH3>
      <p>
        State the topic clearly and one honest reason to watch. Put your main
        search phrase in naturally, near the front. Avoid all caps and
        clickbait. The{" "}
        <Link
          href="/guides/how-to-write-better-youtube-titles"
          className="underline hover:text-neutral-900"
        >
          titles guide
        </Link>{" "}
        covers this in depth.
      </p>
      <GuideH3>Thumbnail</GuideH3>
      <p>
        The thumbnail works with the title to earn the click. A clear, readable
        image with a face or a simple subject usually outperforms a cluttered
        one. It should accurately represent the video — a misleading thumbnail
        causes viewers to leave, which hurts your recommendation performance.
      </p>
      <GuideH3>Description</GuideH3>
      <p>
        Lead with a clear summary of what the video is and what it offers, then
        describe what is covered and add relevant links. The description is your
        second chance to tell YouTube what the video is about. See the{" "}
        <Link
          href="/guides/how-to-write-a-youtube-description"
          className="underline hover:text-neutral-900"
        >
          description guide
        </Link>
        .
      </p>
      <GuideH3>Tags</GuideH3>
      <p>
        A small but free signal. Use your topic and related phrases, about ten
        to twenty, and keep them consistent with your title and description.
        They are the last box to tick, not the first. See the{" "}
        <Link
          href="/guides/how-youtube-tags-work"
          className="underline hover:text-neutral-900"
        >
          tags guide
        </Link>
        .
      </p>

      <GuideH2>A beginner's weekly loop</GuideH2>
      <p>
        You do not need a tool chest of fancy SEO software to get started. Each
        week: pick one keyword phrase you can realistically cover; make the best
        video you can on it; write a clear title and a two-line summary that
        use that phrase honestly; add a relevant description and a small tag
        set. After a week or two, open YouTube Studio and read the click-through
        rate and average percentage viewed for the video. That is your feedback
        loop. Change one thing, wait, and compare.
      </p>

      <GuideH2>What to ignore as a beginner</GuideH2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Any tool that promises instant rankings or views.</strong> The
          behaviour metrics that decide recommendations are not something a
          daily "hack" can buy.
        </li>
        <li>
          <strong>Keyword-stuffed titles and descriptions.</strong> They read as
          spam and add nothing for viewers or for understanding.
        </li>
        <li>
          <strong>Heartache over individual analytics.</strong> On a small
          channel, single videos swing wildly; judge patterns across several
          uploads, not one.
        </li>
      </ul>

      <GuideH2>Bottom line</GuideH2>
      <p>
        YouTube SEO for beginners is a short list: make videos people finish,
        match your topic to the terms people search, and frame it clearly in the
        title and description. Master that loop, and the specialised tricks
        become small refinements on a solid foundation.
      </p>
    </GuideLayout>
  );
}