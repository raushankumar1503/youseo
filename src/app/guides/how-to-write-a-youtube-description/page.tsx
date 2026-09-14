import Link from "next/link";
import GuideLayout, { GuideH2, GuideH3, guideMetadata, GUIDE_TITLES } from "@/components/GuideLayout";

export const metadata = guideMetadata("how-to-write-a-youtube-description");
const META = GUIDE_TITLES["how-to-write-a-youtube-description"];

export default function Article() {
  return (
    <GuideLayout
      slug="how-to-write-a-youtube-description"
      title={META.title}
      intro="The description is where you answer the two questions every potential viewer has — what is this about, and why should I watch — and give YouTube the context it needs to understand your video."
      updated={META.updated}
      relatedSlugs={[
        "how-youtube-tags-work",
        "how-to-find-youtube-keywords",
        "youtube-seo-for-beginners",
      ]}
    >
      <p>
        Compared to the title, the description feels like a background detail —
        but it is doing three separate jobs. It summarises the video for people
        who are deciding whether to watch. It tells YouTube what the video is
        about so search and recommendations can match it to viewers. And it is
        where you put the practical stuff — timestamps, links, and calls to
        action — that makes a video more useful. A missing or copy-paste
        description leaves all of that undone.
      </p>

      <GuideH2>What a strong description contains</GuideH2>
      <p>
        The best descriptions are structured: the first two lines act as the
        hook and the summary, then the body expands into what is covered, and
        finally supporting links and a call to action. Viewers only see the
        first two or three lines before they have to expand it, so those opening
        lines are doing the most work.
      </p>

      <GuideH2>Start with the value in the first two lines</GuideH2>
      <p>
        Write a sentence or two that immediately tells a reader what the video
        is about and what they will get from it. Keep it natural and specific.
        "In this video we show how to set up a website from scratch with no
        coding" is far better than a generic "Welcome to my channel." This is
        also the place where you can naturally use your main keyword once, but
        write for a human first. The opener should read like the best one-line
        summary a friend would give you.
      </p>

      <GuideH2>Explain what the video covers</GuideH2>
      <GuideH3>Expand beyond the first lines</GuideH3>
      <p>
        After the hook, add a short paragraph or two that describes the content
        and the value a viewer gets. Cover the key points, the audience it is
        for, and the result they can expect. This fuller context is what gives
        YouTube more signals about your topic than the title alone, and it
        helps with ranking for related terms — the secondary phrases around your
        main topic.
      </p>
      <GuideH3>Use a short list of what is covered</GuideH3>
      <p>
        A brief bullet list of the main points (three to five) makes the
        description skimmable and reinforces the topic for anyone scanning.
        Each bullet should be a real thing the video covers — not a wall of
        keywords. If your video has chapters, list them with timestamps here;
        chapters improve navigation and are used in search results.
      </p>

      <GuideH2>Add relevant details and links</GuideH2>
      <p>
        The description is also your workspace. Add relevant links (sources,
        next videos, a related playlists), and a call to action — usually one
        line asking people to subscribe or to watch a recommended next video.
        Keep the call to action to one or two lines; filling the whole
        description with subscribe prompts reads as spam. Only include links
        that genuinely belong to the video. Hidden or unrelated links are
        against YouTube's policies and can hurt trust.
      </p>

      <GuideH2>How keywords fit in</GuideH2>
      <p>
        Use your primary keyword naturally in the opening, once. Use related and
        long-tail phrases in the body where they fit a sentence. Do not paste a
        list of keywords at the bottom or repeat phrases to pump density —
        keyword stuffing looks like spam to viewers and adds nothing for search.
        If you are unsure what phrases matter, see the{" "}
        <Link
          href="/guides/how-to-find-youtube-keywords"
          className="underline hover:text-neutral-900"
        >
          keyword research guide
        </Link>
        .
        A rough target many creators aim for is a few hundred words of genuinely
        useful description, but accuracy matters far more than length.
      </p>

      <GuideH2>A simple template</GuideH2>
      <p>
        If you are drawing a blank, this basic structure works for many videos:
        a one-to-two-sentence hook with the main topic and value; a paragraph on
        what the viewer will learn; three to five bullet points of the main
        sections (with timestamps if you use chapters); a line of relevant links
        and sources; one short call to action; and a line of common search
        terms related to the topic applied naturally in a sentence, not as a
        tag list. The generator produces a description close to this structure —
        edit it so every sentence is true of your actual video before you
        publish.
      </p>

      <GuideH2>What to avoid</GuideH2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Copy-pasting the same description onto every video.</strong> It
          tells YouTube nothing unique about this specific video and tells
          viewers nothing at all.
        </li>
        <li>
          <strong>Keyword walls.</strong> A block of unrelated phrases reads as
          spam and helps nothing.
        </li>
        <li>
          <strong>Claims the video does not support.</strong> If the description
          promises content that is not in the video, viewers leave early and it
          damages the video's performance.
        </li>
        <li>
          <strong>Ignoring the first two lines.</strong> The opening is the only
          part most viewers read before clicking "show more".
        </li>
      </ul>

      <GuideH2>Bottom line</GuideH2>
      <p>
        Treat the description as the summary and context your video deserves.
        Lead with value, expand into the topic with real search language, add
        useful links, and keep every sentence true. It helps viewers decide, it
        helps YouTube categorise, and it takes only a few minutes to get right.
      </p>
    </GuideLayout>
  );
}