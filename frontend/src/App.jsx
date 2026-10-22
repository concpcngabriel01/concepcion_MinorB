import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { api } from "./api";
import { useAuth } from "./auth";

const POKEMON_TYPES = ["water", "fire", "wind", "light", "darkness", "lightning", "rock", "nature"];
const TYPE_COLORS = {
  water: "#dcecff",
  fire: "#e8f2ff",
  wind: "#edf5ff",
  light: "#d5e8ff",
  darkness: "#e4edfa",
  lightning: "#dcecff",
  rock: "#edf4fc",
  nature: "#e8f2ff",
};

const buttonStyles = {
  primary: "inline-flex min-h-[42px] items-center justify-center rounded-lg border border-accent bg-gradient-to-r from-[#3478d4] to-[#5d9bea] px-[18px] text-[13px] font-bold text-white transition hover:-translate-y-px hover:from-accent-dark hover:to-[#3478d4] disabled:cursor-wait disabled:opacity-60",
  secondary: "inline-flex min-h-[42px] items-center justify-center rounded-lg border border-line bg-white px-[18px] text-[13px] font-bold text-ink transition hover:-translate-y-px hover:bg-blue-50",
  heroSecondary: "inline-flex min-h-[42px] items-center justify-center rounded-lg border border-white/40 bg-white/10 px-[18px] text-[13px] font-bold text-white transition hover:bg-white/20",
  danger: "inline-flex min-h-[42px] items-center justify-center rounded-lg border border-blue-200 bg-white px-[18px] text-[13px] font-bold text-blue-700 transition hover:bg-blue-50",
};

const fieldStyles = "h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition placeholder:text-blue-300 focus:border-accent focus:ring-[3px] focus:ring-accent/15";

function Pokeball({ small = false }) {
  return (
    <svg
      aria-hidden="true"
      className={small ? "h-9 w-9 drop-shadow-md" : "h-[200px] w-[200px] drop-shadow-2xl sm:h-[220px] sm:w-[220px]"}
      viewBox="0 0 200 200"
    >
      <defs>
        <linearGradient id="ball-highlight" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#dcecff" />
        </linearGradient>
        <clipPath id="ball-clip"><circle cx="100" cy="100" r="91" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="95" fill="#fff" />
      <g clipPath="url(#ball-clip)">
        <path d="M0 0h200v100H0z" fill="#3478d4" />
        <path d="M0 100h200v100H0z" fill="url(#ball-highlight)" />
        <path d="M0 94h200v12H0z" fill="#17345f" />
      </g>
      <circle cx="100" cy="100" r="21" fill="#fff" stroke="#17345f" strokeWidth="8" />
      <circle cx="100" cy="100" r="91" fill="none" stroke="#17345f" strokeWidth="5" />
    </svg>
  );
}

function Header() {
  const { access, username, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/");
  }

  return (
    <header className="flex h-[76px] items-center justify-between rounded-b-[10px] border-b-[3px] border-accent bg-gradient-to-r from-[#17345f] to-[#3478d4] px-5 sm:h-[82px] sm:px-7">
      <Link aria-label="Pokédex home" className="inline-flex items-center gap-3 font-display text-sm font-bold tracking-[.12em] text-white" to="/">
        <Pokeball small />
        <span>POKÉDEX<span className="mt-[3px] block font-mono text-[9px] tracking-[.13em] text-blue-200">TRAINER SYSTEM</span></span>
      </Link>
      <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-6">
        {access ? (
          <>
            <NavLink className={({ isActive }) => `text-xs font-semibold transition hover:text-blue-200 sm:text-[13px] ${isActive ? "text-blue-200" : "text-blue-50"}`} to="/pokedex">My Pokédex</NavLink>
            <span className="hidden font-mono text-[11px] tracking-wide text-blue-100 sm:inline">{username}</span>
            <button className={buttonStyles.primary} onClick={handleSignOut} type="button">Sign out</button>
          </>
        ) : (
          <>
            <NavLink className={({ isActive }) => `text-xs font-semibold transition hover:text-blue-200 sm:text-[13px] ${isActive ? "text-blue-200" : "text-blue-50"}`} to="/login">Sign in</NavLink>
            <Link className={`${buttonStyles.primary} min-h-9 px-3 sm:px-[18px]`} to="/register">Create account</Link>
          </>
        )}
      </nav>
    </header>
  );
}

function Layout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1240px] flex-col px-[17px] sm:px-6 lg:px-[42px]">
      <Header />
      <main className="flex-1 py-7 sm:py-[42px]">
        <Outlet />
      </main>
      <footer className="flex justify-between gap-3 border-t border-line py-[17px] pb-[23px] font-mono text-[8px] tracking-[.05em] text-blue-500 sm:text-[9px] sm:tracking-[.11em]">
        <span>YOUR PERSONAL POKÉDEX</span>
        <span>CATALOGUE · OBSERVE · DISCOVER</span>
      </footer>
    </div>
  );
}

function ProtectedRoute() {
  const { access } = useAuth();
  return access ? <Outlet /> : <Navigate replace to="/login" state={{ next: `${location.pathname}${location.search}` }} />;
}

function HomePage() {
  const { access } = useAuth();
  return (
    <div>
      <section className="relative flex min-h-[400px] items-center justify-center overflow-hidden rounded-[18px] border border-white/20 bg-gradient-to-br from-[#17345f] via-[#2864ae] to-[#70a9ed] px-6 py-12 shadow-2xl sm:min-h-[440px] sm:px-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative z-10 mx-auto max-w-[760px] py-3 text-center sm:py-[30px]">
          <span className="font-mono text-[11px] tracking-[.14em] text-blue-100 uppercase">TRAINER DATABASE · ONLINE</span>
          <h1 className="my-5 mb-[22px] font-display text-[clamp(48px,7vw,86px)] leading-[.98] tracking-[-.075em] text-white">
            Your journey<br />starts <span className="text-blue-200">here.</span>
          </h1>
          <p className="mx-auto mb-7 max-w-[560px] text-sm leading-[1.75] text-blue-50 sm:text-base">
            Meet new Pokémon, build your collection, and keep every discovery in one place. Your next adventure is only a Poké Ball away.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link className={buttonStyles.primary} to={access ? "/pokedex" : "/register"}>{access ? "Open Pokédex" : "Become a trainer"} <span aria-hidden="true">&nbsp;↗</span></Link>
            <Link className={buttonStyles.heroSecondary} to={access ? "/pokedex" : "/login"}>{access ? "View collection" : "Trainer sign in"}</Link>
          </div>
        </div>
      </section>
      <section aria-label="Pokédex features" className="grid grid-cols-1 gap-2 pt-[14px] sm:grid-cols-3 sm:gap-[14px] sm:pt-[22px]">
        <Feature title="08 TYPES" detail="Discover every element" />
        <Feature title="YOUR TEAM" detail="Build your collection" />
        <Feature title="FULL STATS" detail="Know your Pokémon" />
      </section>
    </div>
  );
}

function Feature({ title, detail }) {
  return (
    <div className="rounded-[9px] border border-line border-b-[3px] border-b-accent bg-white px-3 py-3 sm:px-5 sm:py-[17px]">
      <strong className="mb-1 block font-display text-[13px] font-semibold sm:text-[17px]">{title}</strong>
      <span className="font-mono text-[7px] tracking-[.02em] text-muted uppercase sm:text-[9px] sm:tracking-[.08em]">{detail}</span>
    </div>
  );
}

function AuthPage({ register = false }) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const next = location.state?.next || "/pokedex";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (register) {
        await api("/users/", { method: "POST", body: values });
      }
      await signIn(values.username, values.password);
      navigate(next.startsWith("/") && !next.startsWith("//") ? next : "/pokedex", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-[980px] overflow-hidden rounded-[10px] border border-line bg-white shadow-xl md:min-h-[480px] md:grid-cols-[1fr_minmax(350px,460px)]">
      <aside className="relative flex min-h-[190px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#17345f] to-[#4d8bd8] p-[23px] text-white sm:p-[38px] md:min-h-0">
        <div className="relative z-10">
          <span className="font-mono text-[11px] tracking-[.14em] text-blue-100 uppercase">Pokédex trainer system</span>
          <h2 className="my-3 max-w-[300px] font-display text-[29px] leading-[1.08] tracking-[-.06em] sm:my-[17px] sm:text-[37px]">
            {register ? "Ready to become a Pokémon Trainer?" : "Welcome back, Trainer."}
          </h2>
          <p className="max-w-[300px] text-xs leading-[1.7] text-blue-50 sm:text-[13px]">
            {register ? "Create your trainer account and start building your Pokémon collection." : "Sign in to view your Pokémon and continue your journey."}
          </p>
        </div>
        <span className="relative z-10 hidden font-mono text-[9px] tracking-[.09em] text-blue-200 sm:block">TRAINER NETWORK · ONLINE</span>
      </aside>
      <div className="p-[23px] sm:p-10">
        <h1 className="mb-[7px] font-display text-[31px] tracking-[-.05em]">{register ? "Create account" : "Welcome back"}</h1>
        <p className="mb-[25px] text-xs text-muted">{register ? "A few details and your Pokédex is ready." : "Enter your trainer details to continue."}</p>
        {error && <p className="mb-4 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900" role="alert">{error}</p>}
        <form className="grid gap-[14px]" onSubmit={handleSubmit}>
          <Field autoComplete="username" id="username" label="Trainer name" maxLength={150} name="username" required />
          {register && <Field autoComplete="email" id="email" label="Email address" name="email" type="email" />}
          <Field autoComplete={register ? "new-password" : "current-password"} id="password" label="Password" name="password" required type="password" />
          {register && <Field autoComplete="new-password" id="confirm_password" label="Confirm password" name="confirm_password" required type="password" />}
          <button className={`${buttonStyles.primary} mt-1 w-full`} disabled={busy} type="submit">
            {busy ? "Please wait…" : register ? "Create my Pokédex" : "Sign in"} {!busy && <span aria-hidden="true">&nbsp;↗</span>}
          </button>
        </form>
        <p className="mt-[19px] text-center text-xs text-muted">
          {register ? "Already have an account? " : "New trainer? "}
          <Link className="font-bold text-blue-700 hover:underline" to={register ? "/login" : "/register"}>{register ? "Sign in" : "Create an account"}</Link>
        </p>
      </div>
    </section>
  );
}

function Field({ id, label, ...inputProps }) {
  return (
    <label className="grid gap-[7px] text-[11px] font-bold text-blue-900" htmlFor={id}>
      {label}
      <input className={fieldStyles} id={id} {...inputProps} />
    </label>
  );
}

function CollectionPage() {
  const [pokemon, setPokemon] = useState([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/pokemons/")
      .then(setPokemon)
      .catch((requestError) => setError(requestError.message));
  }, []);

  const filtered = pokemon.filter((entry) => {
    const text = `${entry.name} ${entry.description || ""} ${entry.type}`.toLocaleLowerCase();
    return (!type || entry.type === type) && (!query || text.includes(query.toLocaleLowerCase()));
  });

  return (
    <section>
      <div className="mb-[30px] flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-[11px] tracking-[.14em] text-accent uppercase">Your personal collection</span>
          <h1 className="mt-2 mb-0 font-display text-[clamp(34px,5vw,54px)] tracking-[-.06em]">My Pokédex</h1>
          <p className="mt-2 mb-0 text-sm text-muted">Every encounter has a story. Keep yours here.</p>
        </div>
        <Link className={`${buttonStyles.primary} w-full sm:w-auto`} to="/pokedex/new">＋ &nbsp; Add an entry</Link>
      </div>
      <div className="mb-[21px] flex flex-col gap-3 sm:flex-row">
        <input className={`${fieldStyles} flex-1`} aria-label="Search your discoveries" onChange={(event) => setQuery(event.target.value)} placeholder="Search your discoveries…" type="search" />
        <select className={fieldStyles} aria-label="Filter by type" onChange={(event) => setType(event.target.value)} value={type}>
          <option value="">All types</option>
          {POKEMON_TYPES.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}
        </select>
      </div>
      {error ? (
        <EmptyState message={error} title="We couldn't load your Pokédex." />
      ) : filtered.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-[19px] lg:grid-cols-3">
          {filtered.map((entry) => <PokemonCard key={entry.id} pokemon={entry} />)}
        </div>
      ) : pokemon.length ? (
        <EmptyState message="Try another search or type filter." title="No Pokémon found" />
      ) : (
        <EmptyState action={<Link className={buttonStyles.primary} to="/pokedex/new">Add your first entry</Link>} message="Add your first Pokémon to begin your Pokédex." title="No discoveries yet" />
      )}
    </section>
  );
}

function PokemonCard({ pokemon }) {
  return (
    <Link className="overflow-hidden rounded-[9px] border border-line bg-white transition hover:-translate-y-[3px] hover:shadow-xl" to={`/pokedex/${pokemon.id}`}>
      <div className="relative flex h-[205px] items-center justify-center overflow-hidden sm:h-[190px]" style={{ backgroundImage: "linear-gradient(145deg, #ffffff 5%, #dcecff 100%)", backgroundColor: TYPE_COLORS[pokemon.type] || "#e9eff8" }}>
        {pokemon.background && <img alt="" className="absolute h-full w-full object-cover" onError={(event) => { event.currentTarget.hidden = true; }} src={pokemon.background} />}
        <img alt={pokemon.name} className="relative z-[1] h-[135px] w-[135px] object-contain" onError={(event) => { event.currentTarget.hidden = true; }} src={pokemon.avatar} />
        <span className="absolute top-3 right-3 z-[2] rounded bg-white/90 px-[9px] py-[7px] font-mono text-[10px] text-ink">LVL {pokemon.level}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[.06em] text-muted uppercase">
          <span>ENTRY {String(pokemon.id).padStart(3, "0")}</span>
          <span className="rounded-full bg-blue-50 px-[9px] py-[5px] text-blue-700">{pokemon.type}</span>
        </div>
        <h2 className="mt-3 mb-[7px] font-display text-[21px] tracking-[-.04em]">{pokemon.name}</h2>
        <p className="mb-[15px] min-h-[38px] text-xs leading-[1.6] text-muted">{pokemon.description || "No description has been added yet."}</p>
        <div className="grid grid-cols-4 border-t border-blue-100 pt-3">
          <CardStat label="health" value={pokemon.health} />
          <CardStat label="attack" value={pokemon.attack} />
          <CardStat label="defense" value={pokemon.defense} />
          <CardStat label="speed" value={pokemon.speed} />
        </div>
      </div>
    </Link>
  );
}

function CardStat({ label, value }) {
  return <div className="text-center"><strong className="block font-display text-[13px] font-semibold">{value}</strong><span className="font-mono text-[8px] text-blue-400 uppercase">{label}</span></div>;
}

function EmptyState({ title, message, action }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-[13px] text-center text-sm text-muted">
      <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-line text-[27px] text-accent" aria-hidden="true">＋</span>
      <strong className="text-ink">{title}</strong>
      <span>{message}</span>
      {action}
    </div>
  );
}

function PokemonFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const edit = Boolean(id);
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(edit);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!edit) return;
    api(`/pokemons/${id}/`)
      .then(setPokemon)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [edit, id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    for (const key of ["avatar", "background"]) {
      const file = formData.get(key);
      if (file instanceof File && file.size === 0) formData.delete(key);
    }
    try {
      const result = await api(`/pokemons/${edit ? `${id}/` : ""}`, {
        method: edit ? "PATCH" : "POST",
        body: formData,
      });
      navigate(edit ? `/pokedex/${id}` : `/pokedex/${result.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading text="Loading Pokémon…" />;
  if (edit && error && !pokemon) return <EmptyState message={error} title="Entry unavailable" />;

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(400px,1.2fr)] lg:gap-[45px]">
      <div className="pt-3">
        <span className="font-mono text-[11px] tracking-[.14em] text-accent uppercase">{edit ? "Update entry" : "New entry"}</span>
        <h1 className="mt-3 mb-[15px] font-display text-[clamp(36px,5vw,58px)] leading-[1.02] tracking-[-.07em]">{edit ? <>Edit your<br />discovery.</> : <>Who did you<br />meet today?</>}</h1>
        <p className="max-w-[420px] text-sm leading-[1.7] text-muted">Capture the details while they are fresh. You can always come back and update your Pokédex later.</p>
      </div>
      <div className="rounded-[9px] border border-line bg-white p-[18px] shadow-lg sm:p-[25px]">
        <div className="mb-[21px] border-b border-blue-100 pb-[17px]">
          <h2 className="mb-[5px] font-display text-[19px]">{edit ? "Entry details" : "New Pokémon"}</h2>
          <p className="mb-0 text-xs text-muted">Fields marked with * are required.</p>
        </div>
        {error && <p className="mb-4 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900" role="alert">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field defaultValue={pokemon?.name || ""} id="name" label="Name *" maxLength={50} name="name" required />
            <label className="grid gap-[7px] text-[11px] font-bold text-blue-900" htmlFor="type">Type *
              <select className={fieldStyles} defaultValue={pokemon?.type || "water"} id="type" name="type" required>
                {POKEMON_TYPES.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}
              </select>
            </label>
            <label className="grid gap-[7px] text-[11px] font-bold text-blue-900 sm:col-span-2" htmlFor="description">Description
              <textarea className={`${fieldStyles} h-auto min-h-[100px] resize-y py-3`} defaultValue={pokemon?.description || ""} id="description" name="description" placeholder="What makes this Pokémon remarkable?" />
            </label>
            <NumberField defaultValue={pokemon?.level || 1} id="level" label="Level *" min={1} name="level" />
            <NumberField defaultValue={pokemon?.health || 100} id="health" label="Health *" min={100} name="health" />
            <NumberField defaultValue={pokemon?.attack || 10} id="attack" label="Attack *" min={10} name="attack" />
            <NumberField defaultValue={pokemon?.defense || 5} id="defense" label="Defense *" min={5} name="defense" />
            <NumberField defaultValue={pokemon?.speed || 15} id="speed" label="Speed *" min={15} name="speed" />
            <FileField id="avatar" label="Portrait" name="avatar" />
            <FileField id="background" label="Background image" name="background" />
          </div>
          <div className="mt-[21px] flex flex-wrap justify-end gap-[10px] border-t border-blue-100 pt-[18px]">
            <Link className={buttonStyles.secondary} to={edit ? `/pokedex/${id}` : "/pokedex"}>Cancel</Link>
            <button className={buttonStyles.primary} disabled={busy} type="submit">{busy ? "Saving…" : edit ? "Save changes" : "Add to Pokédex"}</button>
          </div>
        </form>
      </div>
    </section>
  );
}

function NumberField({ id, label, ...props }) {
  return <Field id={id} label={label} type="number" {...props} />;
}

function FileField({ id, label, name }) {
  return (
    <label className="grid gap-[7px] text-[11px] font-bold text-blue-900" htmlFor={id}>
      {label}
      <input className="w-full text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-ink hover:file:bg-blue-100" accept="image/*" id={id} name={name} type="file" />
      <small className="font-normal text-muted">Optional. Leave empty to use the current image.</small>
    </label>
  );
}

function PokemonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/pokemons/${id}/`)
      .then(setPokemon)
      .catch((requestError) => setError(requestError.message));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm(`Delete ${pokemon.name} from your Pokédex? This cannot be undone.`)) return;
    try {
      await api(`/pokemons/${id}/`, { method: "DELETE" });
      navigate("/pokedex");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (error) return <EmptyState message={error} title="Entry unavailable" />;
  if (!pokemon) return <Loading text="Opening Pokédex entry…" />;

  return (
    <section className="grid gap-7 lg:grid-cols-[minmax(260px,.9fr)_minmax(0,1.1fr)] lg:gap-10">
      <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[9px] sm:min-h-[380px]" style={{ backgroundImage: "linear-gradient(145deg, #ffffff 5%, #dcecff 100%)", backgroundColor: TYPE_COLORS[pokemon.type] || "#e9eff8" }}>
        {pokemon.background && <img alt="" className="absolute h-full w-full object-cover" onError={(event) => { event.currentTarget.hidden = true; }} src={pokemon.background} />}
        <img alt={pokemon.name} className="relative z-[1] h-[185px] w-full object-contain sm:h-[230px]" onError={(event) => { event.currentTarget.hidden = true; }} src={pokemon.avatar} />
      </div>
      <div className="py-3">
        <span className="font-mono text-[11px] tracking-[.14em] text-accent uppercase">Pokédex entry {String(pokemon.id).padStart(3, "0")} · {pokemon.type}</span>
        <h1 className="mt-3 mb-3 font-display text-[clamp(40px,6vw,68px)] tracking-[-.07em]">{pokemon.name}</h1>
        <p className="leading-[1.7] text-muted">{pokemon.description || "No description has been added yet."}</p>
        {error && <p className="rounded border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900" role="alert">{error}</p>}
        <div className="my-[22px] mb-[27px] flex flex-wrap gap-[9px]">
          <Link className={buttonStyles.primary} to={`/pokedex/${id}/edit`}>Edit entry</Link>
          <button className={buttonStyles.danger} onClick={handleDelete} type="button">Delete</button>
          <Link className={buttonStyles.secondary} to="/pokedex">Back</Link>
        </div>
        <div className="grid grid-cols-2 border-t border-line sm:grid-cols-3">
          <DetailStat label="Level" value={pokemon.level} />
          <DetailStat label="Health" value={pokemon.health} />
          <DetailStat label="Attack" value={pokemon.attack} />
          <DetailStat label="Defense" value={pokemon.defense} />
          <DetailStat label="Speed" value={pokemon.speed} />
        </div>
      </div>
    </section>
  );
}

function DetailStat({ label, value }) {
  return <div className="border-b border-line py-[15px]"><strong className="block font-display text-[22px] font-semibold">{value}</strong><span className="font-mono text-[9px] tracking-[.09em] text-muted uppercase">{label}</span></div>;
}

function Loading({ text }) {
  return <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-sm text-muted"><span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" />{text}</div>;
}

function NotFoundPage() {
  return <EmptyState action={<Link className={buttonStyles.primary} to="/">Return home</Link>} message="We couldn't find that page." title="Page not found" />;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<AuthPage />} />
        <Route path="register" element={<AuthPage register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="pokedex" element={<CollectionPage />} />
          <Route path="pokedex/new" element={<PokemonFormPage />} />
          <Route path="pokedex/:id" element={<PokemonDetailPage />} />
          <Route path="pokedex/:id/edit" element={<PokemonFormPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
