/* TRUSTCARE COLLECTION CENTRE — shared client logic
   NOTE: This demo persists data in the browser's localStorage on each
   device, so there is no shared backend yet. Wiring this to a real
   database + SMS/email OTP service is the next step before launch. */

const HD = {
  USER_KEY: 'hd_user',
  BOOKINGS_KEY: 'hd_bookings',

  getUser(){
    try { return JSON.parse(localStorage.getItem(this.USER_KEY)); }
    catch(e){ return null; }
  },
  setUser(user){
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },
  logout(){
    localStorage.removeItem(this.USER_KEY);
    window.location.href = 'index.html';
  },
  getBookings(){
    try { return JSON.parse(localStorage.getItem(this.BOOKINGS_KEY)) || []; }
    catch(e){ return []; }
  },
  addBooking(booking){
    const all = this.getBookings();
    all.unshift(booking);
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(all));
  },
  findBooking(id){
    return this.getBookings().find(b => b.id === id);
  },
  makeId(){
    const n = Math.floor(1000 + Math.random()*9000);
    const d = new Date();
    const stamp = `${d.getFullYear().toString().slice(2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    return `HD-${stamp}-${n}`;
  },
  fmtMoney(n){ return `₹${n.toLocaleString('en-IN')}`; },
  fmtDate(iso){
    if(!iso) return '—';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' });
  },
  requireAuth(nextPage){
    const u = this.getUser();
    if(!u){
      window.location.href = `login.html?next=${encodeURIComponent(nextPage)}`;
      return null;
    }
    return u;
  },
  renderUserPill(mountId){
    const el = document.getElementById(mountId);
    if(!el) return;
    const u = this.getUser();
    if(!u){
      el.innerHTML = `<a href="login.html" class="btn btn-ghost">Log in</a>`;
      return;
    }
    const label = u.name ? u.name.split(' ')[0] : (u.email || u.phone);
    el.innerHTML = `<span class="user-pill">${label} <button id="hdLogoutBtn">Log out</button></span>`;
    document.getElementById('hdLogoutBtn').addEventListener('click', () => HD.logout());
  }
};

// Fill any element with data-year with current year (footer copyright)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
