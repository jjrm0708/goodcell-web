export const SITE = {
  nombre: 'Good Cell',
  titulo: 'Good Cell - Tecnología Premium',
  telefonoVisible: '310 5000800',
  whatsappNumero: '573105000800',
  instagramUsuario: '@good_cell',
  instagramUrl: 'https://www.instagram.com/good_cell/',
  mapsUrl:
    'https://www.google.com/maps/place/Good+Cell/@4.8125191,-75.810229,149274m/data=!3m1!1e3!4m15!1m7!3m6!1s0x8e38f52b3ad3bb29:0xc3438b57fbb1742c!2sGood+Cell!8m2!3d4.540112!4d-75.6658447!16s%2Fg%2F11g72x_ct2!3m6!1s0x8e38f52b3ad3bb29:0xc3438b57fbb1742c!8m2!3d4.540112!4d-75.6658447!15sCglnb29kIGNlbGySASV0ZWxlY29tbXVuaWNhdGlvbnNfZXF1aXBtZW50X3N1cHBsaWVy4AEA!16s%2Fg%2F11g72x_ct2',
  direccion: {
    centroComercial: 'Centro Comercial Unicentro',
    calle: 'Cra. 14 #6-02, Local 252',
    ciudad: 'Armenia, Quindío, Colombia',
  },
  horarios: [
    { dias: 'Lunes a jueves', horas: '10:00 a. m. a 8:00 p. m.' },
    { dias: 'Viernes y sábado', horas: '10:00 a. m. a 9:00 p. m.' },
    { dias: 'Domingo', horas: '11:00 a. m. a 7:00 p. m.' },
  ],
} as const

export function whatsappUrl(mensaje: string): string {
  return `https://wa.me/${SITE.whatsappNumero}?text=${encodeURIComponent(mensaje)}`
}