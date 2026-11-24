/**
 * DEMO DATA ONLY.
 * Every name, email and link below is fictitious. The rows copy the column layout and
 * the entry style of the real Musikalista registry (free-text genres, mixed casing,
 * blank optional fields) so the search and cleaning logic can be shown. No real
 * member data is stored in this repository.
 */

export const DEPARTMENTS = ["CBEAM", "CEAS", "CITE", "CITHM", "CON", "CCJE"] as const;
export const MEMBER_ROLES = ["Performer", "Performer & Volunteer", "Volunteer"] as const;

export type Department = (typeof DEPARTMENTS)[number];
export type MemberRole = (typeof MEMBER_ROLES)[number];

export interface Member {
  department: Department;
  level: number;
  fullName: string;
  program: string;
  birthdate: string; // ISO yyyy-mm-dd
  facebook: string;
  email: string;
  instrument: string; // blank when the member owns none
  musicRoles: string;
  genre: string;
  role: MemberRole;
}

export const COLUMNS: { key: keyof Member; label: string; width: number }[] = [
  { key: "department", label: "COLLEGE DEPARTMENT", width: 160 },
  { key: "level", label: "LEVEL", width: 64 },
  { key: "fullName", label: "FULL NAME", width: 210 },
  { key: "program", label: "PROGRAM", width: 230 },
  { key: "birthdate", label: "BIRTHDATE", width: 110 },
  { key: "facebook", label: "FACEBOOK LINKS", width: 250 },
  { key: "email", label: "EMAIL", width: 270 },
  { key: "instrument", label: "OWNS ANY INSTRUMENT?", width: 230 },
  { key: "musicRoles", label: "MUSIC ROLES", width: 250 },
  { key: "genre", label: "GENRE", width: 150 },
  { key: "role", label: "ROLE", width: 170 },
];

const fb = (handle: string) => `https://www.facebook.com/${handle}`;

export const MEMBERS: Member[] = [
  { department: "CITE", level: 4, fullName: "Dela Cruz, Juan Paulo R.", program: "BS Computer Science", birthdate: "2004-03-14", facebook: fb("sample.juanpaulo"), email: "juan_paulo_delacruz@school.edu.ph", instrument: "Acoustic Guitar (w/o Pickup)", musicRoles: "Vocalist", genre: "OPM", role: "Performer & Volunteer" },
  { department: "CITE", level: 2, fullName: "Lorenzo, Andrea Mae L.", program: "BS Information Technology", birthdate: "2006-07-02", facebook: fb("sample.andreamae"), email: "andrea_mae_lorenzo@school.edu.ph", instrument: "", musicRoles: "VOCALIST, KEYBOARDIST", genre: "r&b, ballad", role: "Performer" },
  { department: "CEAS", level: 3, fullName: "Reyes, Paolo Enrique T.", program: "Bachelor in Multimedia Arts", birthdate: "2005-11-21", facebook: fb("sample.paoloenrique"), email: "paolo_enrique_reyes@school.edu.ph", instrument: "Electric Guitar, Amplifier", musicRoles: "Lead Guitarist, Rhythm Guitarist", genre: "Rock, pop", role: "Performer" },
  { department: "CITHM", level: 1, fullName: "Villanueva, Bea Patricia S.", program: "BS Tourism Management", birthdate: "2007-03-30", facebook: fb("sample.beapatricia"), email: "bea_patricia_villanueva@school.edu.ph", instrument: "", musicRoles: "Vocalist", genre: "Any", role: "Volunteer" },
  { department: "CITE", level: 4, fullName: "Mendoza, Carlo Benedict B.", program: "BS Electronics Engineering", birthdate: "2003-09-08", facebook: fb("sample.carlobenedict"), email: "carlo_benedict_mendoza@school.edu.ph", instrument: "Acoustic Drums", musicRoles: "DRUMMER/PERCUSSIONIST", genre: "rock", role: "Performer" },
  { department: "CBEAM", level: 2, fullName: "Garcia, Sofia Isabel M.", program: "BS Accountancy", birthdate: "2006-01-17", facebook: fb("sample.sofiaisabel"), email: "sofia_isabel_garcia@school.edu.ph", instrument: "Keyboard", musicRoles: "Keyboardist", genre: "Ballad, OPM", role: "Performer" },
  { department: "CON", level: 3, fullName: "Bautista, Rafael Jose P.", program: "BS Nursing", birthdate: "2005-05-25", facebook: fb("sample.rafaeljose"), email: "rafael_jose_bautista@school.edu.ph", instrument: "Electric Bass", musicRoles: "Bassist", genre: "Funk, R&B", role: "Performer & Volunteer" },
  { department: "CEAS", level: 1, fullName: "Francisco, Kristine Joy A.", program: "BS Psychology", birthdate: "2007-08-11", facebook: fb("sample.kristinejoy"), email: "kristine_joy_francisco@school.edu.ph", instrument: "", musicRoles: "SONGWRITER, VOCALIST", genre: "indie", role: "Performer" },
  { department: "CITE", level: 3, fullName: "Aquino, Nathaniel E.", program: "BS Information Technology", birthdate: "2005-03-03", facebook: fb("sample.nathaniel"), email: "nathaniel_aquino@school.edu.ph", instrument: "Acoustic/Electric Guitar, Keyboard", musicRoles: "Rhythm Guitarist, MUSIC PROD (MIDI)", genre: "Rock,opm, pop", role: "Performer" },
  { department: "CCJE", level: 2, fullName: "Castillo, Marco Luis D.", program: "BS Criminology", birthdate: "2006-12-05", facebook: fb("sample.marcoluis"), email: "marco_luis_castillo@school.edu.ph", instrument: "Cajon", musicRoles: "Percussionist", genre: "Reggae", role: "Volunteer" },
  { department: "CBEAM", level: 4, fullName: "Navarro, Angelica Rose F.", program: "BSBA Marketing Management", birthdate: "2004-06-19", facebook: fb("sample.angelicarose"), email: "angelica_rose_navarro@school.edu.ph", instrument: "", musicRoles: "Vocalist", genre: "Pop", role: "Performer & Volunteer" },
  { department: "CEAS", level: 2, fullName: "Torres, Tristan Emmanuel C.", program: "AB Communication", birthdate: "2006-10-28", facebook: fb("sample.tristanemmanuel"), email: "tristan_emmanuel_torres@school.edu.ph", instrument: "Ukulele", musicRoles: "VOCALIST, GUITARIST", genre: "OPM, acoustic", role: "Performer" },
  { department: "CITHM", level: 3, fullName: "Flores, Danica Mae G.", program: "BS Hospitality Management", birthdate: "2005-02-09", facebook: fb("sample.danicamae"), email: "danica_mae_flores@school.edu.ph", instrument: "", musicRoles: "Vocalist", genre: "R&B", role: "Volunteer" },
  { department: "CITE", level: 1, fullName: "Manalo, Elijah Luis N.", program: "BS Computer Science", birthdate: "2007-04-22", facebook: fb("sample.elijahluis"), email: "elijah_luis_manalo@school.edu.ph", instrument: "Electric Guitar", musicRoles: "Lead Guitarist", genre: "metal", role: "Performer" },
  { department: "CON", level: 2, fullName: "Pascual, Hannah Grace V.", program: "BS Nursing", birthdate: "2006-03-12", facebook: fb("sample.hannahgrace"), email: "hannah_grace_pascual@school.edu.ph", instrument: "Violin", musicRoles: "Violinist", genre: "Classical, ballad", role: "Performer" },
  { department: "CEAS", level: 4, fullName: "Salazar, Elias Andres H.", program: "BS Education - English", birthdate: "2004-11-02", facebook: fb("sample.eliasandres"), email: "elias_andres_salazar@school.edu.ph", instrument: "Acoustic Guitar (no pickup), Electric Bass", musicRoles: "Bassist, Rhythm Guitarist", genre: "Any", role: "Performer & Volunteer" },
  { department: "CBEAM", level: 1, fullName: "Lim, Erika Chloe J.", program: "BS Accountancy", birthdate: "2007-09-15", facebook: fb("sample.erikachloe"), email: "erika_chloe_lim@school.edu.ph", instrument: "", musicRoles: "Volunteer (logistics)", genre: "pop", role: "Volunteer" },
  { department: "CITE", level: 2, fullName: "Ocampo, Renz Aldrin K.", program: "BS Industrial Engineering", birthdate: "2006-05-07", facebook: fb("sample.renzaldrin"), email: "renz_aldrin_ocampo@school.edu.ph", instrument: "Drum pad, Electric Drums", musicRoles: "DRUMMER", genre: "Rock, alternative", role: "Performer" },
  { department: "CCJE", level: 3, fullName: "Valdez, Patricia Anne O.", program: "BS Criminology", birthdate: "2005-07-29", facebook: fb("sample.patriciaanne"), email: "patricia_anne_valdez@school.edu.ph", instrument: "", musicRoles: "Vocalist", genre: "Ballad", role: "Performer" },
  { department: "CITHM", level: 2, fullName: "Herrera, Joaquin Rafael M.", program: "BS Tourism Management", birthdate: "2006-08-23", facebook: fb("sample.joaquinrafael"), email: "joaquin_rafael_herrera@school.edu.ph", instrument: "Keyboard, Synthesizer", musicRoles: "KEYBOARDIST, MUSIC PROD (ELECTRONIC)", genre: "EDM, pop", role: "Performer" },
  { department: "CEAS", level: 3, fullName: "Morales, Isabella Kate R.", program: "Bachelor in Multimedia Arts", birthdate: "2005-12-18", facebook: fb("sample.isabellakate"), email: "isabella_kate_morales@school.edu.ph", instrument: "", musicRoles: "Vocalist, Songwriter", genre: "Indie, OPM", role: "Performer & Volunteer" },
  { department: "CITE", level: 4, fullName: "Cruz, Nicolo Ray S.", program: "BS Information Technology", birthdate: "2004-01-26", facebook: fb("sample.nicoloray"), email: "nicolo_ray_cruz@school.edu.ph", instrument: "Electric guitars bass ampli", musicRoles: "Bassist", genre: "rock", role: "Performer" },
  { department: "CON", level: 1, fullName: "Rivera, Samantha Louise B.", program: "BS Nursing", birthdate: "2007-06-04", facebook: fb("sample.samanthalouise"), email: "samantha_louise_rivera@school.edu.ph", instrument: "", musicRoles: "Volunteer (documentation)", genre: "Any", role: "Volunteer" },
  { department: "CBEAM", level: 3, fullName: "Tan, Vincent Allen Q.", program: "BSBA Financial Management", birthdate: "2005-10-10", facebook: fb("sample.vincentallen"), email: "vincent_allen_tan@school.edu.ph", instrument: "Acoustic Guitar", musicRoles: "Rhythm Guitarist, Acoustic Guitarist", genre: "Acoustic, OPM", role: "Performer" },
];

export const SEARCH_CATEGORIES = [
  { key: "fullName", label: "FULL NAME" },
  { key: "program", label: "PROGRAM" },
  { key: "department", label: "COLLEGE DEPARTMENT" },
  { key: "genre", label: "GENRE" },
  { key: "musicRoles", label: "MUSIC ROLES" },
  { key: "birthdate", label: "BIRTHDATE" },
] as const;

export type SearchKey = (typeof SEARCH_CATEGORIES)[number]["key"];
