const folderOne = 'https://drive.google.com/drive/folders/1KSXdB4BYz4sDem7V4RGWCrItSJ6rk-R3?usp=drive_link';
const folderTwo = 'https://drive.google.com/drive/folders/1BV7M3OhiIH-7OR6sJJXlU8Psarg0myAZ?usp=drive_link';

export default function ConsumerDefenseSourceFolders() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <p className="eyebrow">Connected source library</p>
        <h2 className="text-2xl font-semibold text-white">Bankruptcy and Credit Dispute Files</h2>
        <p className="mt-2 text-sm text-slate-300">
          These folders are now part of the source library for the guided workflow. Open them when you need the original supporting files.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <a className="rounded-xl border border-slate-700 bg-slate-950 p-4 transition hover:border-white" href={folderOne} target="_blank" rel="noreferrer">
            <strong className="text-white">Chapter 7 case files and creditor matrices</strong>
            <p className="mt-2 text-sm text-slate-300">
              Includes the bankruptcy dispute packet, petition review summary, Chapter 7 creditor summaries, filing packages, creditor matrices, household standards, and debt-tracker files.
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-emerald-300">Open folder</span>
          </a>

          <a className="rounded-xl border border-slate-700 bg-slate-950 p-4 transition hover:border-white" href={folderTwo} target="_blank" rel="noreferrer">
            <strong className="text-white">Credit bureau and escalation letters</strong>
            <p className="mt-2 text-sm text-slate-300">
              Includes Equifax, Experian, and TransUnion FCRA §611 letters, method-of-verification letters, CFPB complaint drafts, and BBB complaint materials.
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-emerald-300">Open folder</span>
          </a>
        </div>

        <div className="mt-4 rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
          <strong className="text-white">Newly confirmed source details</strong>
          <p className="mt-2">
            The existing bankruptcy dispute packet already contains Tomas Nieves, 7421 Willow Thorne Dr, Aubrey, TX 76227, date of birth 12/18/1970, masked SSN ending 3181, case 25-42914, discharge date 01/07/2026, the Equifax filing-date issue, the missing closing date, and the Bank of America $10,849 post-discharge reporting dispute.
          </p>
        </div>
      </div>
    </section>
  );
}
