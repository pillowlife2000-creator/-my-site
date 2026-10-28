// Lead form for the landing pages: saves to the Supabase "leads" table.
// The page name (data-page on the form) is added to business_type so you know which page the lead came from.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://kynnuobrybwdcixoefwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bm51b2JyeWJ3ZGNpeG9lZnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NjM5NzAsImV4cCI6MjA5NzMzOTk3MH0.tY6J0ig66nw3MT3oGBiuVYTf-yYkWAwoopauC9f6aPk'
);

const form = document.getElementById('leadForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const $ = (id) => document.getElementById(id);
  const name = $('name').value.trim();
  const phone = $('phone').value.trim();
  const company = $('company').value.trim();
  const role = $('role').value;
  const btn = $('submitBtn');

  ['nameErr', 'phoneErr', 'roleErr'].forEach(id => $(id).style.display = 'none');
  let valid = true;
  if (name.length < 2)                     { $('nameErr').style.display = 'block'; valid = false; }
  if (phone.replace(/\D/g, '').length < 9) { $('phoneErr').style.display = 'block'; valid = false; }
  if (!role)                               { $('roleErr').style.display = 'block'; valid = false; }
  if (!valid) return;

  btn.disabled = true; btn.textContent = 'שולח...';
  let utm = '';
  try { utm = sessionStorage.getItem('utm') || ''; } catch (err) {}
  const businessType = [form.dataset.page + ' – ' + role, company, utm && 'utm: ' + utm].filter(Boolean).join(' | ');
  const { error } = await supabase.from('leads').insert({ name, phone, business_type: businessType });
  if (error) { btn.disabled = false; btn.textContent = 'שליחה'; alert('אירעה שגיאה, נסו שוב.'); return; }
  window.trackLead?.(form.dataset.page);
  form.style.display = 'none';
  $('success').style.display = 'block';
});
