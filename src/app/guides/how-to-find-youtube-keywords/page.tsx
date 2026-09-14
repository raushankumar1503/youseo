import GuideLayout, { GuideH2, GuideH3, guideMetadata, GUIDE_TITLES } from "@/components/GuideLayout";

export const metadata = guideMetadata("how-to-find-youtube-keywords");
const META = GUIDE_TITLES["how-to-find-youtube-keywords"];

export default function Article() {
  return (
    <GuideLayout
      slug="how-to-find-youtube-keywords"
      title={META.title}
      intro="The single most useful thing you can do before pressing record is decide which search terms people actually type for the topic you want to cover. Here is how to find them."
      updated={META.updated}
      relatedSlugs={[
        "youtube-seo-for-beginners",
        "how-to-write-better-youtube-titles",
        "how-to-write-a-youtube-description",
      ]}
    >
      <p>
        A keyword is the phrase a viewer types into the search box. If your
        video is about the same thing people are searching for, YouTube has a
        reason to show it. If your video is about something related but phrased
        differently — or about a topic barely anyone searches for — no amount of
        optimisation will manufacture demand. Keyword research is simply the
        step of finding out what people actually type so you can match the
        topic, title, and description to real search behaviour.
      </p>

      <GuideH2>Start from the question, not the product</GuideH2>
      <p>
        People rarely search for a channel name or a video title they have never
        heard of. They search for problems, questions, and things they want to
        learn. The best keywords usually come from a plain sentence: "I want to
        learn how to X" or "I need to fix Y". Write down a handful of the ways
        you would describe your topic as a search — beginners' phrasing, expert
        phrasing, and the specific question someone might type. These rough
        ideas become the raw material you then check for real demand.
      </p>

      <GuideH2>Use YouTube itself for research</GuideH2>
      <GuideH3>Let autocomplete show you real queries</GuideH3>
      <p>
        Open YouTube with a private browsing window and start typing your topic
        into the search box. The dropdown suggestions are real, popular queries
        built from what people type. Type "how to" then your topic, and note the
        completions. Do the same with your topic followed by "for beginners",
        "vs", "best", "tutorial", and so on. Each completion is a long-tail
        keyword — a specific, lower-competition phrase that you might realistically
        cover in a single video.
      </p>
      <GuideH3>Read the "people also search" and related videos</GuideH3>
      <p>
        After you run one search, note the related phrases and videos YouTube
        shows. These surface the topics around your keyword that viewers bundle
        together. If every related video on "meal prep" also mentions "5 days",
        then "5-day meal prep" is a phrase worth knowing about. This gives you
        natural secondary keywords to weave into your description.
      </p>

      <GuideH2>Add the free tools, used sparingly</GuideH2>
      <p>
        Free keyword tools (Google Keyword Planner, and free tiers of tools like
        Google Trends and YouTube keyword tools) can add rough volume and
        competition context. Google Trends is genuinely useful for seeing whether
        interest is growing or seasonal. But do not let tool numbers intimidate
        you. A keyword with modest volume and weak competition from a small
        creator is often more valuable than a huge one you will never rank for.
      </p>

      <GuideH2>Distinguish primary and long-tail keywords</GuideH2>
      <p>
        A typical video revolves around one primary keyword — the main phrase in
        your title — and several long-tail keywords — specific, usually
        lower-competition phrases in your description and tags. "Meal prep" is a
        primary keyword; "5-day meal prep for a busy week, no repeats" is a
        long-tail keyword. New creators do well to target the long tail first:
        it is easier to be the video that fully answers a specific question than
        to beat established channels at a broad one.
      </p>
      <p>
        When you pick a topic, set rough volume expectations aside and ask three
        questions: is this a phrase people search (the autocomplete test), can I
        make the best answer to it, and is it specific enough that my video has a
        fair chance to be found? This is a realistic definition of a good YouTube
        keyword.
      </p>

      <GuideH2>From keywords to metadata</GuideH2>
      <p>
        Your chosen primary keyword goes into the title, used naturally and near
        the front. Long-tail and related phrases go into the description where
        they fit a sentence, and a handful appear as tags. Consistency matters:
        keep the same core phrase across the title, description, and tags so
        YouTube gets one clear picture. If you enter a topic into the generator,
        it does this matching for you — but check that the terms it chose are
        the ones you actually want to rank for and that they truly fit your
        video.
      </p>

      <GuideH2>What to avoid</GuideH2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Guessing instead of checking.</strong> The autocomplete test
          takes seconds and prevents you from targeting phrases nobody types.
        </li>
        <li>
          <strong>Only chasing high-volume keywords.</strong> Broad terms are
          competitive; specific ones are where new channels win.
        </li>
        <li>
          <strong>Targeting a keyword you do not fully cover.</strong> If your
          video only touches the topic, viewers will leave and it will underperform.
        </li>
        <li>
          <strong>Keyword stuffing.</strong> Matching demand is not the same as
          repeating the phrase until it reads like spam.
        </li>
      </ul>

      <GuideH2>Bottom line</GuideH2>
      <p>
        Finding keywords is the early, cheap part of making a YouTube video. Use
        autocomplete and related searches to surface real queries, pick a
        primary keyword you can fully answer plus the long-tail phrases around
        it, and carry those terms consistently into your title, description, and
        tags. Do that and you give the video the best possible chance to be
        found by exactly the people it was made for.
      </p>
    </GuideLayout>
  );
}