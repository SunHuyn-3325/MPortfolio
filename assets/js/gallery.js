document.querySelectorAll('.project-gallery').forEach(function(gallery) {
  var folder = gallery.dataset.folder;
  var count = parseInt(gallery.dataset.count, 10);
  var skip = (gallery.dataset.skip || '').split(',').map(Number).filter(Boolean);

  // Build thumbnail strip
  var strip = document.createElement('div');
  strip.className = 'gallery-strip';

  for (var i = 1; i <= count; i++) {
    if (skip.includes(i)) continue;
    (function(idx) {
      var thumb = document.createElement('div');
      thumb.className = 'gallery-thumb';
      thumb.dataset.index = idx;
      var img = document.createElement('img');
      img.src = folder + '/' + idx + '.png';
      img.alt = 'Slide ' + idx;
      img.loading = 'lazy';
      thumb.appendChild(img);
      thumb.addEventListener('click', function() { openLightbox(folder, count, skip, idx); });
      strip.appendChild(thumb);
    })(i);
  }
  gallery.appendChild(strip);
});

// Lightbox
var lb = document.createElement('div');
lb.id = 'gallery-lightbox';
lb.innerHTML = [
  '<div class="lb-backdrop"></div>',
  '<button class="lb-close" aria-label="Close">✕</button>',
  '<button class="lb-prev" aria-label="Previous">‹</button>',
  '<div class="lb-img-wrap"><img class="lb-img" src="" alt=""></div>',
  '<button class="lb-next" aria-label="Next">›</button>',
  '<div class="lb-counter"></div>'
].join('');
document.body.appendChild(lb);

var lbImg = lb.querySelector('.lb-img');
var lbCounter = lb.querySelector('.lb-counter');
var _folder, _count, _skip, _current;

function getValid(folder, count, skip) {
  var list = [];
  for (var i = 1; i <= count; i++) { if (!skip.includes(i)) list.push(i); }
  return list;
}

function openLightbox(folder, count, skip, idx) {
  _folder = folder; _count = count; _skip = skip; _current = idx;
  var valid = getValid(folder, count, skip);
  lbImg.src = folder + '/' + idx + '.png';
  lbCounter.textContent = (valid.indexOf(idx) + 1) + ' / ' + valid.length;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function navigate(dir) {
  var valid = getValid(_folder, _count, _skip);
  var pos = valid.indexOf(_current);
  var next = valid[(pos + dir + valid.length) % valid.length];
  _current = next;
  lbImg.src = _folder + '/' + next + '.png';
  lbCounter.textContent = (valid.indexOf(next) + 1) + ' / ' + valid.length;
}

function closeLightbox() {
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
lb.querySelector('.lb-prev').addEventListener('click', function() { navigate(-1); });
lb.querySelector('.lb-next').addEventListener('click', function() { navigate(1); });

document.addEventListener('keydown', function(e) {
  if (!lb.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') navigate(-1);
  else if (e.key === 'ArrowRight') navigate(1);
  else if (e.key === 'Escape') closeLightbox();
});
