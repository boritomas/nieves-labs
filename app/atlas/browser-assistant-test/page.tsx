import { AtlasHeader, AtlasHero } from '@/components/AtlasShell';
import { getAtlasPageAccess, redirectToAtlasLogin } from '@/lib/atlas-auth';

export const metadata = {
  title: 'Browser Assistant Test Form | Atlas',
};

export default async function BrowserAssistantTestPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  const access = await getAtlasPageAccess(token);
  if (!access.authorized) redirectToAtlasLogin('/atlas/browser-assistant-test');
  const atlasToken = access.emergencyToken;

  return (
    <main className="site-shell">
      <AtlasHeader token={atlasToken} />
      <AtlasHero
        token={atlasToken}
        title="Browser Assistant Test Form"
        subtitle="A realistic lender-style form used only to validate field inspection, mapping, autofill, founder-only exclusion, upload handling, save state, and resume behavior."
      />
      <form className="panel atlas-lender-test-form" data-atlas-lender-test="true">
        <input type="hidden" name="applicationId" value="atlas-local-test" />
        <div className="atlas-form-grid">
          <label htmlFor="businessName">Business Name<input id="businessName" name="business_name" required /></label>
          <label htmlFor="businessEmail">Business Email<input id="businessEmail" name="business_email" type="email" required /></label>
          <label htmlFor="website">Website URL<input id="website" name="website_url" placeholder="https://example.com" required /></label>
          <label htmlFor="businessPhone">Business Phone<input id="businessPhone" name="business_phone" inputMode="tel" /></label>
          <label htmlFor="businessAddress">Business Address<input id="businessAddress" name="business_address" autoComplete="street-address" /></label>
          <label htmlFor="businessZip">Business ZIP<input id="businessZip" name="business_zip" inputMode="numeric" /></label>
          <label htmlFor="industry">Industry
            <select id="industry" name="industry" required defaultValue="">
              <option value="" disabled>Select industry</option>
              <option>AI software and automation</option>
              <option>Professional services</option>
              <option>Retail</option>
              <option>Construction</option>
            </select>
          </label>
          <label htmlFor="state">State
            <select id="state" name="state" required defaultValue="">
              <option value="" disabled>Select state</option>
              <option>Texas</option>
              <option>California</option>
              <option>Florida</option>
              <option>New York</option>
            </select>
          </label>
          <label htmlFor="entityType">Entity Type
            <select id="entityType" name="entity_type" defaultValue="">
              <option value="" disabled>Select entity type</option>
              <option>LLC</option>
              <option>Sole proprietorship</option>
              <option>Corporation</option>
              <option>Requires founder or state portal verification</option>
            </select>
          </label>
          <label htmlFor="formationDate">Formation Date<input id="formationDate" name="formation_date" type="date" /></label>
          <label htmlFor="ownership">Ownership %<input id="ownership" name="ownership_percentage" type="number" min="0" max="100" required /></label>
          <label htmlFor="requestedAmount">Requested Amount<input id="requestedAmount" name="loan_amount" type="number" min="1000" required /></label>
          <label htmlFor="founderFirstName">Founder First Name<input id="founderFirstName" name="first_name" required /></label>
          <label htmlFor="founderLastName">Founder Last Name<input id="founderLastName" name="last_name" required /></label>
        </div>
        <label htmlFor="businessDescription">Business Description<textarea id="businessDescription" name="business_description" required /></label>
        <label htmlFor="managementExperience">Management Experience<textarea id="managementExperience" name="management_experience" /></label>
        <label htmlFor="useOfFunds">Use of Funds<textarea id="useOfFunds" name="use_of_funds" required /></label>
        <fieldset>
          <legend>Funding purpose</legend>
          <label><input type="radio" name="funding_purpose" value="working_capital" /> Working capital</label>
          <label><input type="radio" name="funding_purpose" value="equipment" /> Equipment</label>
          <label><input type="radio" name="funding_purpose" value="marketing" /> Marketing</label>
        </fieldset>
        <fieldset>
          <legend>Communication preference</legend>
          <label><input type="checkbox" name="email_ok" /> Email is okay</label>
          <label><input type="checkbox" name="sms_ok" /> SMS is okay</label>
        </fieldset>
        <div className="atlas-form-grid">
          <label htmlFor="einDocument">Upload EIN confirmation<input id="einDocument" name="ein_document" type="file" /></label>
          <label htmlFor="businessPlan">Upload business plan<input id="businessPlan" name="business_plan" type="file" /></label>
        </div>
        <section className="panel founder-only-test-fields">
          <p className="eyebrow">Founder-only fields</p>
          <div className="atlas-form-grid">
            <label htmlFor="ssn">SSN / ITIN<input id="ssn" name="ssn" autoComplete="off" /></label>
            <label htmlFor="dob">Date of birth<input id="dob" name="date_of_birth" type="date" /></label>
            <label htmlFor="driversLicense">Driver license<input id="driversLicense" name="drivers_license" /></label>
            <label><input type="checkbox" name="credit_authorization" /> I authorize credit review</label>
          </div>
          <button type="button" className="button-secondary">Final Submit</button>
        </section>
        <p role="alert" className="form-message" hidden>Validation message placeholder.</p>
        <div className="hero-actions">
          <button type="button" className="button-primary" data-save-application>Save application</button>
          <button type="button" className="button-secondary">Continue</button>
        </div>
      </form>
    </main>
  );
}
