import Editly from 'editly';
import axios from 'axios';

const API_KEY = '33637909-dd50db7cb97c8889678d5e861';
const BASE_URL = 'https://pixabay.com/api/videos/';

const getVideosWithTag = async (tag) => {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${tag}`);
    return response.data.hits;
  } catch (e) {
    console.error(error);
  }
};

async function func({ canvas }) {
  async function onRender(progress) {
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const text = 'Lorem ipsum dolor sic amet nuc met sugorem toc medoac';
    context.fillStyle = '#FFF';
    context.font = '60px Arial';
    context.textAlign = 'center';
    const textWidth = context.measureText(text).width;

    if (textWidth > canvas.width) {
      var mots = text.split(' ');
      var ligne = '';
      var y = centerY;
      for (var i = 0; i < mots.length; i++) {
        var mot = mots[i];
        var largeur_mot = context.measureText(mot).width;
        if (largeur_mot > canvas.width) {
          // Si un mot est plus grand que la largeur maximale du canvas, on le divise en plusieurs lignes
          var caracteres = mot.split('');
          var temp_ligne = '';
          for (var j = 0; j < caracteres.length; j++) {
            var caractere = caracteres[j];
            if (
              context.measureText(temp_ligne + caractere).width > canvas.width
            ) {
              context.fillText(temp_ligne, 10, y);
              y = centerY + 20;
              temp_ligne = caractere;
            } else {
              temp_ligne += caractere;
            }
          }
          context.fillText(temp_ligne, 10, y);
          y = centerY + 20;
        } else if (context.measureText(ligne + mot).width > canvas.width) {
          // Si la ligne est trop grande, passez à la ligne suivante
          const lineWidth = context.measureText(ligne + mot).width;
          context.fillRect(centerX - canvas.width / 2, y, lineWidth + 40, 100);
          context.fillStyle = '#000';
          context.fillText(ligne, canvas.width / 2, y + 60);
          ligne = mot + ' ';
          y = centerY + 40;
        } else {
          ligne += mot + ' ';
        }
      }
      context.fillText(ligne, 10, y);
    } else {
      // Si le text est plus petit que la largeur maximale du canvas, affichez-le sur une seule ligne
      context.fillText(text, 10, centerY);
    }
  }

  function onClose() {
    // Cleanup if you initialized anything
  }

  return { onRender, onClose };
}

const createVideo = async (video) => {
  const composition = await Editly({
    outPath: `./videos/${video.id}.mp4`,
    width: 1080,
    height: 1920,
    defaults: {
      duration: 6,
      transition: {
        name: 'fadecolor',
        duration: 1,
      },
    },
    clips: [
      {
        duration: 6,
        layers: [
          {
            type: 'video',
            path: video.videos.medium.url,
            resizeMode: 'cover',
          },
          {
            type: 'news-title',
            text: 'Girl Facts',
            backgroundColor: 'black',
            position: 'top',
          },
          { type: 'canvas', func },
        ],
      },
    ],
  });

  await composition.run();
  console.log(`Created video ${video.id}.mp4`);
};

const run = async () => {
  const videos = await getVideosWithTag('calm');
  //   for (const video of videos) {
  //     await createVideo(video);
  //   }
  console.log(videos[0]);
  await createVideo(videos[0]);
};

run();
