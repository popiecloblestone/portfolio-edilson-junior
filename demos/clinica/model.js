export const SPECIALTIES = [
  {id:'clinica',name:'Clínica geral',icon:'stethoscope',description:'Um olhar completo para a sua saúde.',duration:30},
  {id:'cardio',name:'Cardiologia',icon:'heart',description:'Atenção especial ao seu coração.',duration:30},
  {id:'dermato',name:'Dermatologia',icon:'spark',description:'Cuidado com a saúde da sua pele.',duration:30},
  {id:'psico',name:'Psicologia',icon:'brain',description:'Um espaço de escuta e acolhimento.',duration:60},
  {id:'nutri',name:'Nutrição',icon:'leaf',description:'Equilíbrio para o seu dia a dia.',duration:60},
  {id:'fisio',name:'Fisioterapia',icon:'activity',description:'Mais movimento e qualidade de vida.',duration:60}
];
export const DOCTORS = [
  {id:'ana',name:'Dra. Ana Ribeiro',specialty:'clinica',initials:'AR',color:'#e1edf7',bio:'Atenção integral e acompanhamento preventivo.'},
  {id:'ricardo',name:'Dr. Ricardo Mendes',specialty:'cardio',initials:'RM',color:'#e5e9f6',bio:'Cuidado cardiovascular e acompanhamento clínico.'},
  {id:'beatriz',name:'Dra. Beatriz Lima',specialty:'dermato',initials:'BL',color:'#f6e9df',bio:'Saúde da pele em todas as fases da vida.'},
  {id:'camila',name:'Camila Oliveira',specialty:'psico',initials:'CO',color:'#eee5f5',bio:'Escuta, acolhimento e bem-estar emocional.'},
  {id:'lucas',name:'Lucas Ferreira',specialty:'nutri',initials:'LF',color:'#e3eee7',bio:'Alimentação e hábitos adaptados à sua rotina.'},
  {id:'pedro',name:'Pedro Santos',specialty:'fisio',initials:'PS',color:'#f8edda',bio:'Mobilidade e reabilitação individualizada.'}
];
export const STATUS = {pending:'Aguardando aprovação',confirmed:'Confirmada',completed:'Realizada',cancelled:'Cancelada',rejected:'Não aprovada',missed:'Não compareceu'};
export function clinicNow(now = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));
  return {date:`${p.year}-${p.month}-${p.day}`,time:`${p.hour}:${p.minute}`};
}
export function addDays(date, days) {const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function weekday(date) {return new Date(date+'T12:00:00').getDay();}
export function minutes(time) {const [h,m]=time.split(':').map(Number);return h*60+m;}
export function timeString(n) {return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
export function duration(doctorId) {return SPECIALTIES.find(s=>s.id===DOCTORS.find(d=>d.id===doctorId)?.specialty)?.duration||30;}
export function overlap(a,b,c,d) {return a<d && c<b;}
export function uid() {return globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;}
export function seed(today=clinicNow().date) {
  const patients=[
    {id:'mariana',name:'Mariana Costa',email:'mariana@example.com',phone:'(11) 90000-0001'},
    {id:'joao',name:'João Almeida',email:'joao@example.com',phone:'(11) 90000-0002'},
    {id:'fernanda',name:'Fernanda Souza',email:'fernanda@example.com',phone:'(11) 90000-0003'},
    {id:'carlos',name:'Carlos Pereira',email:'carlos@example.com',phone:'(11) 90000-0004'},
    {id:'juliana',name:'Juliana Martins',email:'juliana@example.com',phone:'(11) 90000-0005'},
    {id:'roberto',name:'Roberto Dias',email:'roberto@example.com',phone:'(11) 90000-0006'}
  ];
  const appointments=[];
  let n=0;
  for (const offset of [-7,-5,-3,-1,0,1,2,3,5]) {
    const date=addDays(today,offset);
    if(weekday(date)===0)continue;
    const times=weekday(date)===6?['08:00','09:00','10:00']:['09:00','10:30','14:00','15:30'];
    times.forEach((time,i)=>{
      const doctor=DOCTORS[(n+i)%DOCTORS.length];
      const status=offset<0?['completed','completed','missed','cancelled'][i%4]:['confirmed','pending','confirmed','pending'][i%4];
      const createdAt=addDays(date,-2)+'T13:20:00-03:00';
      appointments.push({id:`IN-${String(1000+n).padStart(4,'0')}`,patientId:patients[(n+i)%patients.length].id,doctorId:doctor.id,date,time,status,createdAt,notes:'',history:[{action:'Solicitação criada',at:createdAt}]});n++;
    });
  }
  return {version:1,patients,appointments,blocks:[],hours:{start:'08:00',end:'18:00',breakStart:'12:00',breakEnd:'13:00',saturdayEnd:'12:00'}};
}
export function slots(state,doctorId,date,{excludeId=null,now=clinicNow()}={}) {
  if(!DOCTORS.some(d=>d.id===doctorId)||!/^\d{4}-\d{2}-\d{2}$/.test(date))return [];
  if(date<now.date || date>addDays(now.date,90) || weekday(date)===0)return [];
  const h=state.hours, dur=duration(doctorId), end=minutes(weekday(date)===6?h.saturdayEnd:h.end), out=[];
  for(let start=minutes(h.start);start+dur<=end;start+=30) {
    const finish=start+dur;
    if(date===now.date && start<=minutes(now.time))continue;
    if(overlap(start,finish,minutes(h.breakStart),minutes(h.breakEnd)))continue;
    const busy=state.appointments.some(a=>a.id!==excludeId && a.doctorId===doctorId && a.date===date && !['cancelled','rejected'].includes(a.status) && overlap(start,finish,minutes(a.time),minutes(a.time)+duration(a.doctorId)));
    const blocked=state.blocks.some(b=>(b.doctorId==='all'||b.doctorId===doctorId)&& b.date===date && overlap(start,finish,minutes(b.start),minutes(b.end)));
    if(!busy&&!blocked)out.push(timeString(start));
  }
  return out;
}
export function saveAppointment(state,{patientId,doctorId,date,time,notes='',excludeId=null},now=clinicNow()) {
  if(!state.patients.some(p=>p.id===patientId))throw new Error('Selecione um paciente válido.');
  if(!slots(state,doctorId,date,{excludeId,now}).includes(time))throw new Error('Este horário não está mais disponível. Escolha outro horário.');
  const existing=excludeId?state.appointments.find(a=>a.id===excludeId):null;
  if(excludeId&&(!existing||!['pending','confirmed'].includes(existing.status)))throw new Error('Esta consulta não pode ser remarcada.');
  const stamp=new Date().toISOString();
  if(existing){Object.assign(existing,{doctorId,date,time,status:'pending',notes});existing.history.push({action:'Remarcada — aguardando nova aprovação',at:stamp});return existing;}
  const appointment={id:'IN-'+uid().slice(0,8).toUpperCase(),patientId,doctorId,date,time,status:'pending',createdAt:stamp,notes,history:[{action:'Solicitação criada',at:stamp}]};
  state.appointments.push(appointment);return appointment;
}
export function addBlock(state,block) {
  if(!block.date||!block.start||!block.end||minutes(block.start)>=minutes(block.end))throw new Error('Informe uma data e um intervalo válido.');
  if(block.doctorId!=='all'&&!DOCTORS.some(d=>d.id===block.doctorId))throw new Error('Profissional inválido.');
  const conflicts=state.appointments.some(a=>a.date===block.date && (block.doctorId==='all'||a.doctorId===block.doctorId)&& !['cancelled','rejected'].includes(a.status)&&overlap(minutes(block.start),minutes(block.end),minutes(a.time),minutes(a.time)+duration(a.doctorId)));
  if(conflicts)throw new Error('Há consultas neste intervalo. Remarque ou cancele as consultas antes de bloquear.');
  state.blocks.push({...block,id:uid()});
}
