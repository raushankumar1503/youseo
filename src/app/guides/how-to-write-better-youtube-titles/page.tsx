import Link from "next/link";
import GuideLayout, { GuideH2, GuideH3, guideMetadata, GUIDE_TITLES } from "@/components/GuideLayout";

export const metadata = guideMetadata("how-to-write-better-youtube-titles");
const META = GUIDE_TITLES["how-to-write-better-youtube-titles"];

export default function Article() {
  return (
    <GuideLayout
      slug="how-to-write-better-youtube-titles"
      title={META.title}
      intro="Your title is the first thing a viewer sees and the main thing search and home-page algorithms read about your video. Here is a practical process for writing titles that are specific, honest, and likely to get clicked."
      updated={META.updated}
      relatedSlugs={[
        "youtube-seo-for-beginners",
        "how-to-improve-youtube-click-through-rate",
        "common-youtube-seo-mistakes",
      ]}
    >
      <p>
        Every day, viewers scan rows of thumbnails and titles and make a
        near-instant decision about what to watch. The title is doing a lot of
        work in that split second: it tells people what the video is about, why
        it matters to them, and — ideally — why they should pick it over the
        video next to it. It also happens to be one of the strongest signals
        YouTube uses to understand what your video covers, so search and
        recommendations can decide where it should be shown. Getting the title
        right helps both real viewers and the algorithm.
      </p>

      <GuideH2>What a good YouTube title actually does</GuideH2>
      <p>
        A good title balances three jobs. First, it communicates the topic
        clearly so that someone can tell what the video is about in a glance.
        Second, it signals why the video is worth their time — the benefit, the
        problem it solves, or the specific result they will get. Third, it uses
        the words real people search for, so YouTube has a chance of surfacing
        it to the right viewers. When one of those three is missing, the title
        usually underperforms.
      </p>
      <p>
        Notice what is not on that list: being clever for its own sake. Clever
        titles only help if a viewer can still tell what the video is about. If
        you have to explain your title before anyone can understand it, it is
        not doing its job.
      </p>

      <GuideH2>A simple process for writing titles</GuideH2>
      <GuideH3>Start with the topic, then add the angle</GuideH3>
      <p>
        Begin with the plain subject of your video. Write it as the shortest,
        most boring description you can: "How to change a tire", "Meal prep for
        a busy week", "Editing in DaVinci Resolve for the first time". This is
        your anchor — it guarantees the title stays on-topic and keeps the main
        keyword visible. Then decide on one angle: is this a how-to, a beginner
        guide, a list, a mistake-to-avoid, a comparison, or a result you
        demonstrate? The angle is what differentiates your title from the other
        twenty videos on the same subject.
      </p>
      <p>
        Combine the two. "How to change a tire" becomes "How to Change a Tire in
        15 Minutes (Beginner)". "Meal prep" becomes "Easy 5-Day Meal Prep for a
        Busy Week". "DaVinci editing" becomes "DaVinci Resolve for Beginners:
        Your First Edit". In each case the topic is still obvious, but now the
        viewer also has a reason to click.
      </p>
      <GuideH3>Write the topic into the search terms people use</GuideH3>
      <p>
        Titles are short, so every word counts. Use the phrasing a viewer would
        actually type rather than the phrasing you would use in a formal
        sentence. If your target search is "how to grow indoor plants", put that
        phrase — or most of it — near the front of the title rather than burying
        it at the end. Placing primary keywords early and naturally is a small
        but real search assist. Do not repeat keywords to force them in; one
        clean use is usually better than two awkward ones. If you are unsure
        which phrases matter, see the{" "}
        <Link
          href="/guides/how-to-find-youtube-keywords"
          className="underline hover:text-neutral-900"
        >
          keyword research guide
        </Link>
        .
      </p>
      <GuideH3>Say what changes</GuideH3>
      <p>
        Titles do better when they mention a concrete outcome or a frame of
        time: "15 minutes", "from zero", "for beginners", "step by step",
        "without equipment". These give the brain a reason the video is worth
        the watch time. "How to Build a DIY Desk" is fine; "How to Build a DIY
        Standing Desk for Under $100" gives a viewer a distinct reason to choose
        it. Just make sure the promise is true — a title that promises a result
        the video does not deliver will cost you viewers who leave early.
      </p>
      <GuideH3>Write several, pick the best three</GuideH3>
      <p>
        Titles, like almost everything in YouTube SEO, benefit from options.
        Draft three or four different angles: one direct how-to, one that leads
        with the audience ("for beginners"), one that leads with the benefit or
        result, and one that is short and punchy. Read them out loud. The final
        pick should be the one that is clearest about the topic and most honest
        about the value. If you are using a generator that returns several
        alternatives, use it exactly this way — as a source of angles to
        choose from, not a single answer to paste.
      </p>

      <GuideH2>What to avoid</GuideH2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>All caps and clickbait.</strong> A title that overpromises
          ("You Won't Believe This!") earns clicks but loses trust and hurts
          watch-time when viewers leave.
        </li>
        <li>
          <strong>Keyword stuffing.</strong> Repeating the same phrase three
          times reads as spam to viewers and does nothing for search.
        </li>
        <li>
          <strong>Vague topics.</strong> "Editing Tips" tells a viewer nothing.
          "3 Editing Tips That Instantly Improve Your Videos" does.
        </li>
        <li>
          <strong>Titles that lie.</strong> If the video is not actually about
          what the title claims, viewers will leave quickly, and YouTube will
          stop recommending it to people who are a poor fit.
        </li>
      </ul>

      <GuideH2>How to check whether it worked</GuideH2>
      <p>
        In YouTube Studio, look for the average percentage viewed and the
        click-through rate shown for impressions. A video with a strong click
        rate but low view duration has an honest-signal problem — viewers are
        clicking but not staying, which often means the title promised something
        the video did not deliver. A video with a high view duration but a low
        click rate usually has good content but a weak title or thumbnail. Treat
        those two numbers as feedback, change one variable at a time, and give
        the change a couple of weeks before judging it.
      </p>

      <GuideH2>Bottom line</GuideH2>
      <p>
        Great titles come from a simple loop: state the topic plainly, add one
        honest angle, write it in real search language, and offer several
        versions before committing. The generator can produce strong candidates
        in a second — the craftsmanship is in picking the right one and making
        sure it truly matches the video you made.
      </p>
    </GuideLayout>
  );
}