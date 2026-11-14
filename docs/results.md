# Results

Generated 2026-11-14 by `node bench/report.mjs` from `results/raw/`. How each number is produced: [methodology](methodology.md).

## Overview

| Target | Checks | Post rps @100 | Post p99 ms @100 | Idle MB | Lighthouse (post) | JS KB (/blog) | Filter ready ms | Cold build s | Image MB | Source lines | Packages |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| HTML + nginx | 1214/1214 | 18,299 | 10.4 | 3.3 | 100 | 1.2 | 555 | 2.0 | 92 | 5,180 | 0 |
| Hugo | 1214/1214 | 18,204 | 10.7 | 3.3 | 100 | 1.2 | 560 | 15.1 | 92 | 243 | 0 |
| Nuxt (SSG) | 1214/1214 | 17,190 | 10.7 | 3.3 | 100 | 86.0 | 1,462 | 23.9 | 96 | 501 | 600 |
| Nuxt (SSR) | 1257/1257 | 288 | 397.3 | 37.2 | 100 | 85.8 | 1,430 | 27.9 | 344 | 501 | 600 |
| Next.js (export) | 1214/1214 | 17,603 | 11.3 | 3.3 | 97 | 140.5 | 1,831 | 29.8 | 100 | 544 | 54 |
| Next.js (SSR) | 1257/1257 | 168 | 2,010.3 | 59.6 | 97 | 140.7 | 1,707 | 33.0 | 288 | 544 | 54 |
| Astro (SSG) | 1214/1214 | 18,139 | 9.8 | 3.3 | 100 | 0.0 | 553 | 18.1 | 92 | 352 | 296 |
| Astro (SSR) | 1257/1257 | 1,631 | 90.3 | 31.0 | 100 | 0.0 | 549 | 33.5 | 608 | 352 | 296 |
| SvelteKit (SSG) | 1214/1214 | 17,191 | 11.2 | 3.3 | 100 | 44.0 | 1,118 | 16.9 | 96 | 589 | 89 |
| SvelteKit (SSR) | 1257/1257 | 979 | 123.6 | 25.1 | 100 | 44.0 | 1,109 | 16.7 | 238 | 589 | 89 |
| React Router (prerender) | 1214/1214 | 17,104 | 10.9 | 3.3 | 99 | 119.3 | 1,642 | 15.6 | 94 | 671 | 218 |
| React Router (SSR) | 1257/1257 | 487 | 244.1 | 35.9 | 99 | 118.6 | 1,830 | 20.9 | 331 | 671 | 218 |
| Angular (prerender) | 1214/1214 | 17,345 | 10.4 | 3.4 | 93 | 96.9 | 1,419 | 27.1 | 93 | 796 | 436 |
| Angular (SSR) | 1257/1257 | 123 | 4,281.8 | 39.1 | 94 | 97.2 | 1,414 | 27.1 | 343 | 796 | 436 |
| Qwik City (SSG) | 1214/1214 | 16,613 | 10.4 | 3.3 | 100 | 46.6 | 976 | 19.9 | 97 | 999 | 326 |
| Qwik City (SSR) | 1257/1257 | 214 | 1,147.5 | 34.2 | 100 | 47.5 | 988 | 20.8 | 253 | 999 | 326 |
| Go net/http | 1257/1257 | 3,427 | 147.6 | 7.0 | 100 | 1.2 | 556 | 38.2 | 22 | 542 | 0 |
| Go + htmx | 1257/1257 | 3,373 | 157.3 | 7.0 | 100 | 18.1 | 1,046 | 38.2 | 22 | 542 | 0 |
| Laravel (PHP-FPM) | 1257/1257 | 144 | 756.7 | 38.3 | 100 | 1.2 | 557 | 20.6 | 267 | 1,914 | 74 |
| Laravel (Octane, FrankenPHP) | 1257/1257 | 208 | 530.7 | 105.3 | 100 | 1.2 | 554 | 32.0 | 310 | 1,914 | 74 |
| WordPress | 1259/1259 | 50 | 2,095.1 | 177.7 | 100 | 1.2 | 556 | 27.3 | 803 | 970 | 0 |
| WordPress (page cache) | 1259/1259 | 13,791 | 14.0 | 179.6 | 100 | 1.2 | 559 | 27.3 | 803 | 970 | 0 |
| Ghost | 1214/1214 | 42 | 3,666.3 | 845.6 | 100 | 1.2 | 553 | 75.7 | 2,340 | 606 | 0 |
| Ghost (proxy cache) | 1214/1214 | 12,096 | 15.7 | 839.6 | 100 | 1.2 | 582 | 75.7 | 2,340 | 606 | 0 |

## Server throughput and latency

Requests per second and p99 latency (ms) at 10 and 100 concurrent connections, two cores. Static targets are nginx serving files.

| Target | home rps @10 | home rps @100 | home p99 @100 | blog rps @10 | blog rps @100 | blog p99 @100 | post rps @10 | post rps @100 | post p99 @100 | filtered rps @10 | filtered rps @100 | filtered p99 @100 | notFound rps @10 | notFound rps @100 | notFound p99 @100 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| HTML + nginx | 18,258 | 18,006 | 10.7 | 17,373 | 17,809 | 10.6 | 18,377 | 18,299 | 10.4 | 17,086 | 17,460 | 11.3 | 18,828 | 18,087 | 10.4 |
| Hugo | 17,821 | 17,997 | 10.2 | 16,811 | 17,124 | 10.7 | 18,232 | 18,204 | 10.7 | 16,751 | 17,134 | 11.2 | 18,442 | 18,408 | 10.6 |
| Astro (SSG) | 18,055 | 17,788 | 10.7 | 17,011 | 17,405 | 11.1 | 18,073 | 18,139 | 9.8 | 16,492 | 17,701 | 10.7 | 17,740 | 18,340 | 10.5 |
| Next.js (export) | 17,427 | 17,552 | 11.0 | 10,827 | 10,865 | 22.5 | 16,588 | 17,603 | 11.3 | 10,909 | 10,821 | 23.2 | 17,636 | 18,349 | 10.3 |
| Angular (prerender) | 17,571 | 17,965 | 10.6 | 16,860 | 17,129 | 11.8 | 17,116 | 17,345 | 10.4 | 15,630 | 17,384 | 10.9 | 18,215 | 18,356 | 10.0 |
| SvelteKit (SSG) | 17,843 | 17,581 | 11.4 | 16,509 | 17,147 | 13.1 | 17,588 | 17,191 | 11.2 | 16,164 | 17,096 | 11.0 | 18,366 | 18,230 | 11.0 |
| Nuxt (SSG) | 15,155 | 17,810 | 10.0 | 16,927 | 17,439 | 11.9 | 17,160 | 17,190 | 10.7 | 16,786 | 16,882 | 10.6 | 18,442 | 17,990 | 10.3 |
| React Router (prerender) | 17,943 | 18,011 | 9.9 | 16,128 | 16,332 | 11.5 | 17,129 | 17,104 | 10.9 | 14,443 | 16,573 | 11.7 | 18,497 | 18,873 | 10.4 |
| Qwik City (SSG) | 16,633 | 18,258 | 10.6 | 8,020 | 7,884 | 37.2 | 15,694 | 16,613 | 10.4 | 8,007 | 7,844 | 34.4 | 17,848 | 18,245 | 10.4 |
| WordPress (page cache) | 13,623 | 13,546 | 14.1 | 13,396 | 13,897 | 14.0 | 14,096 | 13,791 | 14.0 | 13,607 | 13,898 | 13.9 | 14,376 | 14,076 | 13.6 |
| Ghost (proxy cache) | 11,132 | 11,444 | 16.5 | 12,197 | 12,285 | 14.8 | 12,209 | 12,096 | 15.7 | 12,126 | 12,185 | 15.6 | 12,572 | 12,232 | 15.3 |
| Go net/http | 3,283 | 2,864 | 163.0 | 578 | 577 | 917.5 | 3,853 | 3,427 | 147.6 | 572 | 576 | 893.1 | 14,476 | 11,996 | 27.8 |
| Go + htmx | 3,314 | 2,874 | 168.0 | 575 | 570 | 921.3 | 3,788 | 3,373 | 157.3 | 1,647 | 1,512 | 318.7 | 14,214 | 11,898 | 28.6 |
| Astro (SSR) | 1,853 | 1,883 | 82.8 | 1,100 | 1,061 | 131.9 | 1,673 | 1,631 | 90.3 | 1,051 | 1,037 | 134.8 | 2,004 | 1,951 | 78.3 |
| SvelteKit (SSR) | 1,178 | 1,196 | 116.0 | 510 | 522 | 218.4 | 906 | 979 | 123.6 | 652 | 646 | 182.4 | 1,898 | 1,926 | 82.1 |
| React Router (SSR) | 519 | 552 | 231.6 | 231 | 240 | 477.4 | 484 | 487 | 244.1 | 449 | 434 | 273.8 | 786 | 785 | 170.1 |
| Nuxt (SSR) | 316 | 299 | 527.7 | 136 | 119 | 5,598.2 | 313 | 288 | 397.3 | 217 | 201 | 1,889.4 | 422 | 442 | 250.5 |
| Qwik City (SSR) | 278 | 272 | 630.5 | 46 | 50 | 4,310.5 | 209 | 214 | 1,147.5 | 109 | 116 | 5,441.1 | 590 | 599 | 211.5 |
| Laravel (Octane, FrankenPHP) | 259 | 258 | 425.1 | 70 | 69 | 1,496.1 | 211 | 208 | 530.7 | 71 | 70 | 1,473.7 | 836 | 823 | 156.3 |
| Next.js (SSR) | 175 | 179 | 1,514.6 | 91 | 86 | 5,689.4 | 164 | 168 | 2,010.3 | 106 | 112 | 4,793.5 | 1,349 | 1,390 | 135.2 |
| Laravel (PHP-FPM) | 162 | 163 | 682.6 | 69 | 70 | 1,500.4 | 143 | 144 | 756.7 | 70 | 70 | 1,490.5 | 407 | 411 | 312.1 |
| Angular (SSR) | 130 | 132 | 4,036.9 | 41 | 44 | 5,435.1 | 125 | 123 | 4,281.8 | 89 | 88 | 6,974.3 | 265 | 259 | 442.2 |
| WordPress | 54 | 53 | 2,011.6 | 44 | 44 | 2,357.1 | 51 | 50 | 2,095.1 | 42 | 43 | 2,429.2 | 54 | 54 | 1,936.2 |
| Ghost | 74 | 72 | 3,659.3 | 16 | 16 | 9,741.4 | 44 | 42 | 3,666.3 | 16 | 16 | 9,472.7 | 281 | 302 | 586.6 |

| Target | Cold start ms | Restart ms | Idle MB | Peak MB under load | CPU cores @100 (post) | Requests per CPU-second (post @100) |
|---|---:|---:|---:|---:|---:|---:|
| HTML + nginx | 544 | 755 | 3.3 | 4.6 | 1.48 | 12,406 |
| Hugo | 515 | 785 | 3.3 | 4.7 | 1.47 | 12,417 |
| Astro (SSG) | 499 | 787 | 3.3 | 4.6 | 1.47 | 12,348 |
| Next.js (export) | 522 | 742 | 3.3 | 11.3 | 1.46 | 12,048 |
| Angular (prerender) | 514 | 776 | 3.4 | 4.6 | 1.48 | 11,720 |
| SvelteKit (SSG) | 526 | 728 | 3.3 | 4.8 | 1.44 | 11,938 |
| Nuxt (SSG) | 531 | 798 | 3.3 | 4.7 | 1.47 | 11,702 |
| React Router (prerender) | 511 | 771 | 3.3 | 4.7 | 1.46 | 11,691 |
| Qwik City (SSG) | 518 | 767 | 3.3 | 12.8 | 1.43 | 11,642 |
| WordPress (page cache) | 14,841 | 1,455 | 179.6 | 185.8 | 1.47 | 9,394 |
| Ghost (proxy cache) | 39,220 | 3,817 | 839.6 | 841.9 | 1.47 | 8,246 |
| Go net/http | 455 | 631 | 7.0 | 30.8 | 1.86 | 1,839 |
| Go + htmx | 492 | 661 | 7.0 | 28.8 | 1.86 | 1,818 |
| Astro (SSR) | 697 | 10,846 | 31.0 | 146.7 | 1.16 | 1,402 |
| SvelteKit (SSR) | 679 | 849 | 25.1 | 138.4 | 1.27 | 770 |
| React Router (SSR) | 909 | 1,079 | 35.9 | 120.1 | 1.14 | 425 |
| Nuxt (SSR) | 859 | 981 | 37.2 | 164.7 | 1.47 | 196 |
| Qwik City (SSR) | 878 | 11,036 | 34.2 | 117.1 | 1.29 | 165 |
| Laravel (Octane, FrankenPHP) | 1,311 | 1,475 | 105.3 | 118.9 | 1.90 | 109 |
| Next.js (SSR) | 1,569 | 1,515 | 59.6 | 202.3 | 1.34 | 125 |
| Laravel (PHP-FPM) | 9,047 | 1,477 | 38.3 | 54.4 | 1.88 | 77 |
| Angular (SSR) | 806 | 11,000 | 39.1 | 316.1 | 1.36 | 90 |
| WordPress | 15,358 | 6,819 | 177.7 | 214.5 | 1.88 | 27 |
| Ghost | 38,773 | 10,395 | 845.6 | 1,324.2 | 1.28 | 33 |

## Browser

Lighthouse mobile, median of three runs, through the shared gzip edge.

### Home

| Target | Perf | FCP ms | LCP ms | TBT ms | CLS | JS KB | Total KB | Requests | Boot-up ms | A11y | SEO | Best practices |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| HTML + nginx | 100 | 754 | 1,429 | 0 | 0.000 | 1.2 | 87.0 | 11 | 34 | 100 | 92 | 78 |
| Hugo | 100 | 753 | 1,428 | 0 | 0.000 | 1.2 | 87.1 | 11 | 33 | 100 | 92 | 78 |
| Nuxt (SSG) | 100 | 753 | 1,907 | 53 | 0.000 | 86.0 | 182.9 | 25 | 377 | 100 | 92 | 78 |
| Astro (SSG) | 100 | 752 | 1,427 | 0 | 0.000 | 0.0 | 85.9 | 10 | 38 | 100 | 92 | 78 |
| Astro (SSR) | 100 | 759 | 1,434 | 0 | 0.000 | 0.0 | 86.2 | 10 | 38 | 100 | 92 | 78 |
| SvelteKit (SSG) | 100 | 754 | 1,875 | 5 | 0.000 | 43.3 | 130.0 | 25 | 136 | 100 | 92 | 78 |
| SvelteKit (SSR) | 100 | 759 | 1,836 | 0 | 0.000 | 43.2 | 129.8 | 25 | 144 | 100 | 92 | 78 |
| Qwik City (SSG) | 100 | 754 | 1,885 | 11 | 0.000 | 44.0 | 144.6 | 35 | 157 | 100 | 92 | 78 |
| Qwik City (SSR) | 100 | 759 | 1,900 | 0 | 0.000 | 44.8 | 145.9 | 35 | 155 | 100 | 92 | 78 |
| Go net/http | 100 | 753 | 1,428 | 0 | 0.000 | 1.2 | 86.8 | 11 | 31 | 100 | 92 | 78 |
| Go + htmx | 100 | 755 | 1,449 | 0 | 0.000 | 18.1 | 103.7 | 12 | 28 | 100 | 92 | 78 |
| Laravel (PHP-FPM) | 100 | 753 | 1,428 | 0 | 0.000 | 1.2 | 87.0 | 11 | 33 | 100 | 92 | 78 |
| Laravel (Octane, FrankenPHP) | 100 | 755 | 1,430 | 0 | 0.000 | 1.2 | 87.4 | 11 | 31 | 100 | 92 | 78 |
| WordPress | 100 | 753 | 1,502 | 0 | 0.000 | 1.2 | 87.0 | 11 | 26 | 100 | 92 | 78 |
| WordPress (page cache) | 100 | 753 | 1,429 | 0 | 0.000 | 1.2 | 87.1 | 11 | 31 | 100 | 92 | 78 |
| Ghost | 100 | 753 | 1,428 | 0 | 0.000 | 1.2 | 87.2 | 11 | 27 | 100 | 92 | 78 |
| Ghost (proxy cache) | 100 | 752 | 1,427 | 0 | 0.000 | 1.2 | 87.2 | 11 | 29 | 100 | 92 | 78 |
| Nuxt (SSR) | 99 | 759 | 1,975 | 72 | 0.000 | 85.8 | 173.0 | 20 | 371 | 100 | 92 | 78 |
| React Router (prerender) | 99 | 756 | 2,198 | 7 | 0.000 | 118.7 | 206.3 | 19 | 260 | 100 | 92 | 78 |
| React Router (SSR) | 99 | 761 | 2,265 | 2 | 0.000 | 118.1 | 206.9 | 19 | 267 | 100 | 92 | 78 |
| Next.js (export) | 97 | 661 | 2,472 | 110 | 0.000 | 140.5 | 375.2 | 32 | 559 | 100 | 92 | 78 |
| Next.js (SSR) | 96 | 670 | 2,502 | 119 | 0.000 | 139.3 | 237.1 | 23 | 523 | 100 | 92 | 78 |
| Angular (SSR) | 95 | 684 | 2,347 | 190 | 0.000 | 95.1 | 183.1 | 12 | 473 | 100 | 92 | 78 |
| Angular (prerender) | 94 | 691 | 2,350 | 224 | 0.000 | 95.0 | 182.3 | 12 | 476 | 100 | 92 | 78 |

### Blog index

| Target | Perf | FCP ms | LCP ms | TBT ms | CLS | JS KB | Total KB | Requests | Boot-up ms | A11y | SEO | Best practices |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| HTML + nginx | 100 | 754 | 1,129 | 0 | 0.000 | 1.2 | 75.8 | 12 | 29 | 100 | 92 | 78 |
| Hugo | 100 | 753 | 1,128 | 0 | 0.000 | 1.2 | 75.8 | 12 | 38 | 100 | 92 | 78 |
| Astro (SSG) | 100 | 753 | 1,128 | 0 | 0.000 | 0.0 | 75.3 | 11 | 37 | 100 | 92 | 78 |
| Astro (SSR) | 100 | 757 | 1,132 | 0 | 0.000 | 0.0 | 75.6 | 11 | 44 | 100 | 92 | 78 |
| SvelteKit (SSG) | 100 | 754 | 1,918 | 20 | 0.000 | 44.0 | 120.3 | 26 | 167 | 100 | 92 | 78 |
| React Router (prerender) | 100 | 754 | 1,757 | 3 | 0.000 | 119.3 | 197.5 | 20 | 364 | 100 | 92 | 78 |
| Qwik City (SSG) | 100 | 903 | 1,697 | 0 | 0.000 | 46.6 | 147.6 | 39 | 153 | 100 | 92 | 78 |
| Qwik City (SSR) | 100 | 907 | 1,661 | 3 | 0.000 | 47.5 | 149.1 | 39 | 142 | 100 | 92 | 78 |
| Go net/http | 100 | 754 | 1,129 | 0 | 0.000 | 1.2 | 75.6 | 12 | 31 | 100 | 92 | 78 |
| Go + htmx | 100 | 755 | 1,332 | 0 | 0.000 | 18.1 | 92.6 | 13 | 96 | 100 | 92 | 78 |
| Laravel (PHP-FPM) | 100 | 754 | 1,129 | 0 | 0.000 | 1.2 | 75.8 | 12 | 33 | 100 | 92 | 78 |
| Laravel (Octane, FrankenPHP) | 100 | 755 | 1,130 | 0 | 0.000 | 1.2 | 76.2 | 12 | 36 | 100 | 92 | 78 |
| WordPress | 100 | 753 | 1,128 | 0 | 0.000 | 1.2 | 75.8 | 12 | 35 | 100 | 92 | 78 |
| WordPress (page cache) | 100 | 753 | 1,128 | 0 | 0.000 | 1.2 | 75.8 | 12 | 41 | 100 | 92 | 78 |
| Ghost | 100 | 754 | 1,129 | 0 | 0.000 | 1.2 | 76.0 | 12 | 35 | 100 | 92 | 78 |
| Ghost (proxy cache) | 100 | 753 | 1,128 | 0 | 0.000 | 1.2 | 76.0 | 12 | 30 | 100 | 92 | 78 |
| Nuxt (SSG) | 99 | 752 | 1,808 | 87 | 0.000 | 86.0 | 171.2 | 26 | 451 | 100 | 92 | 78 |
| Nuxt (SSR) | 99 | 757 | 1,821 | 90 | 0.000 | 85.8 | 163.7 | 21 | 439 | 100 | 92 | 78 |
| Next.js (SSR) | 99 | 700 | 1,922 | 123 | 0.000 | 140.7 | 238.6 | 29 | 567 | 100 | 92 | 78 |
| SvelteKit (SSR) | 99 | 756 | 1,993 | 15 | 0.000 | 44.0 | 120.1 | 26 | 164 | 100 | 92 | 78 |
| React Router (SSR) | 99 | 762 | 2,115 | 2 | 0.000 | 118.6 | 198.2 | 20 | 342 | 100 | 92 | 78 |
| Next.js (export) | 98 | 635 | 1,907 | 136 | 0.000 | 140.5 | 438.2 | 40 | 661 | 100 | 92 | 78 |
| Angular (SSR) | 98 | 708 | 2,024 | 122 | 0.000 | 97.2 | 173.5 | 14 | 528 | 100 | 92 | 78 |
| Angular (prerender) | 97 | 706 | 2,025 | 155 | 0.000 | 96.9 | 172.7 | 14 | 566 | 100 | 92 | 78 |

### Post

| Target | Perf | FCP ms | LCP ms | TBT ms | CLS | JS KB | Total KB | Requests | Boot-up ms | A11y | SEO | Best practices |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| HTML + nginx | 100 | 753 | 1,203 | 0 | 0.000 | 1.2 | 29.0 | 5 | 22 | 100 | 92 | 78 |
| Hugo | 100 | 753 | 1,203 | 0 | 0.000 | 1.2 | 29.0 | 5 | 22 | 100 | 92 | 78 |
| Nuxt (SSG) | 100 | 753 | 1,618 | 37 | 0.000 | 86.0 | 124.9 | 18 | 340 | 100 | 92 | 78 |
| Nuxt (SSR) | 100 | 763 | 1,681 | 61 | 0.000 | 85.8 | 115.4 | 14 | 348 | 100 | 92 | 78 |
| Astro (SSG) | 100 | 753 | 1,053 | 0 | 0.000 | 0.0 | 27.9 | 4 | 26 | 100 | 92 | 78 |
| Astro (SSR) | 100 | 755 | 1,055 | 0 | 0.000 | 0.0 | 27.9 | 4 | 31 | 100 | 92 | 78 |
| SvelteKit (SSG) | 100 | 754 | 1,712 | 4 | 0.000 | 43.6 | 72.7 | 19 | 135 | 100 | 92 | 78 |
| SvelteKit (SSR) | 100 | 757 | 1,759 | 11 | 0.000 | 43.6 | 72.6 | 19 | 141 | 100 | 92 | 78 |
| Qwik City (SSG) | 100 | 753 | 1,257 | 0 | 0.000 | 44.0 | 94.4 | 30 | 145 | 100 | 92 | 78 |
| Qwik City (SSR) | 100 | 758 | 1,574 | 0 | 0.000 | 44.8 | 95.5 | 30 | 157 | 100 | 92 | 78 |
| Go net/http | 100 | 753 | 1,203 | 0 | 0.000 | 1.2 | 28.8 | 5 | 21 | 100 | 92 | 78 |
| Go + htmx | 100 | 754 | 1,247 | 0 | 0.000 | 18.1 | 45.7 | 6 | 28 | 100 | 92 | 78 |
| Laravel (PHP-FPM) | 100 | 754 | 1,204 | 0 | 0.000 | 1.2 | 29.0 | 5 | 25 | 100 | 92 | 78 |
| Laravel (Octane, FrankenPHP) | 100 | 754 | 1,204 | 0 | 0.000 | 1.2 | 29.1 | 5 | 22 | 100 | 92 | 78 |
| WordPress | 100 | 754 | 1,204 | 0 | 0.000 | 1.2 | 28.9 | 5 | 26 | 100 | 92 | 78 |
| WordPress (page cache) | 100 | 754 | 1,204 | 0 | 0.000 | 1.2 | 29.0 | 5 | 22 | 100 | 92 | 78 |
| Ghost | 100 | 754 | 1,204 | 0 | 0.000 | 1.2 | 29.2 | 5 | 29 | 100 | 92 | 78 |
| Ghost (proxy cache) | 100 | 753 | 1,203 | 0 | 0.000 | 1.2 | 29.2 | 5 | 22 | 100 | 92 | 78 |
| React Router (prerender) | 99 | 757 | 2,055 | 0 | 0.000 | 118.9 | 148.8 | 13 | 241 | 100 | 92 | 78 |
| React Router (SSR) | 99 | 766 | 2,074 | 6 | 0.000 | 118.2 | 149.4 | 13 | 254 | 100 | 92 | 78 |
| Next.js (export) | 97 | 666 | 2,285 | 125 | 0.000 | 140.5 | 334.2 | 30 | 566 | 100 | 92 | 78 |
| Next.js (SSR) | 97 | 679 | 2,290 | 114 | 0.000 | 139.3 | 184.2 | 21 | 521 | 100 | 92 | 78 |
| Angular (SSR) | 94 | 697 | 1,952 | 253 | 0.000 | 98.9 | 128.5 | 8 | 453 | 100 | 92 | 78 |
| Angular (prerender) | 93 | 697 | 1,973 | 308 | 0.000 | 98.6 | 128.0 | 8 | 491 | 100 | 92 | 78 |

### Interaction on a throttled phone

Median of five runs: 4x CPU slowdown, 150 ms RTT, 1.6 Mbps.

| Target | Filter ready ms | INP proxy ms | FCP ms | Load event ms | Script KB | Scripts |
|---|---:|---:|---:|---:|---:|---:|
| Astro (SSR) | 549 | 40 | 440 | 494 | 0.0 | 0 |
| Ghost | 553 | 40 | 448 | 500 | 1.2 | 1 |
| Astro (SSG) | 553 | 40 | 448 | 497 | 0.0 | 0 |
| Laravel (Octane, FrankenPHP) | 554 | 40 | 452 | 497 | 1.2 | 1 |
| HTML + nginx | 555 | 40 | 456 | 498 | 1.2 | 1 |
| Go net/http | 556 | 40 | 460 | 499 | 1.2 | 1 |
| WordPress | 556 | 40 | 456 | 497 | 1.2 | 1 |
| Laravel (PHP-FPM) | 557 | 40 | 456 | 501 | 1.2 | 1 |
| WordPress (page cache) | 559 | 40 | 448 | 497 | 1.2 | 1 |
| Hugo | 560 | 40 | 456 | 500 | 1.2 | 1 |
| Ghost (proxy cache) | 582 | 40 | 456 | 504 | 1.2 | 1 |
| Qwik City (SSG) | 976 | 32 | 456 | 705 | 45.6 | 23 |
| Qwik City (SSR) | 988 | 32 | 456 | 706 | 45.6 | 23 |
| Go + htmx | 1,046 | 80 | 444 | 635 | 18.2 | 2 |
| SvelteKit (SSR) | 1,109 | 56 | 464 | 968 | 43.5 | 15 |
| SvelteKit (SSG) | 1,118 | 56 | 468 | 976 | 43.5 | 15 |
| Angular (SSR) | 1,414 | 152 | 300 | 1,168 | 96.9 | 3 |
| Angular (prerender) | 1,419 | 152 | 304 | 1,179 | 96.9 | 3 |
| Nuxt (SSR) | 1,430 | 176 | 464 | 1,041 | 85.1 | 9 |
| Nuxt (SSG) | 1,462 | 176 | 432 | 1,044 | 85.6 | 9 |
| React Router (prerender) | 1,642 | 56 | 508 | 1,034 | 118.9 | 9 |
| Next.js (SSR) | 1,707 | 72 | 476 | 1,624 | 139.9 | 8 |
| React Router (SSR) | 1,830 | 32 | 484 | 1,013 | 117.9 | 8 |
| Next.js (export) | 1,831 | 72 | 484 | 1,646 | 140.1 | 8 |

## Robustness

| Target | Probe 5xx | Reflected XSS | Exposed files | Overload success | Overload p99 ms | Healthy after | Soak errors | Soak memory growth MB | Crash recovery ms | DB down: home / post | DB recovery ms |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| HTML + nginx | none | no | none | 100.0% | 92 | yes | 0 | 0.1 | 597 | n/a | n/a |
| Hugo | none | no | none | 100.0% | 88 | yes | 0 | 0.0 | 603 | n/a | n/a |
| Nuxt (SSG) | none | no | none | 100.0% | 99 | yes | 0 | 0.0 | 590 | n/a | n/a |
| Nuxt (SSR) | none | no | none | 77.1% | 7,884 | yes | 0 | -59.9 | 809 | n/a | n/a |
| Next.js (export) | none | no | none | 100.0% | 91 | yes | 0 | 0.1 | 589 | n/a | n/a |
| Next.js (SSR) | none | no | none | 62.4% | 9,306 | yes | 0 | 7.4 | 1,357 | n/a | n/a |
| Astro (SSG) | none | no | none | 100.0% | 86 | yes | 0 | 0.0 | 606 | n/a | n/a |
| Astro (SSR) | none | no | none | 94.4% | 2,459 | yes | 0 | -0.5 | 685 | n/a | n/a |
| SvelteKit (SSG) | none | no | none | 100.0% | 88 | yes | 0 | 0.1 | 584 | n/a | n/a |
| SvelteKit (SSR) | none | no | none | 88.5% | 584 | yes | 0 | 14.8 | 674 | n/a | n/a |
| React Router (prerender) | none | no | none | 100.0% | 98 | yes | 0 | 0.0 | 605 | n/a | n/a |
| React Router (SSR) | none | no | none | 82.5% | 6,990 | yes | 0 | 0.6 | 994 | n/a | n/a |
| Angular (prerender) | none | no | none | 100.0% | 90 | yes | 0 | 0.0 | 607 | n/a | n/a |
| Angular (SSR) | invalid-utf8:500 | no | none | 57.6% | 3,813 | yes | 0 | -175.3 | 788 | n/a | n/a |
| Qwik City (SSG) | none | no | none | 100.0% | 89 | yes | 0 | 0.1 | 618 | n/a | n/a |
| Qwik City (SSR) | invalid-utf8:500 | no | none | 77.7% | 4,214 | yes | 0 | 1.1 | 886 | n/a | n/a |
| Go net/http | none | no | none | 100.0% | 690 | yes | 0 | -0.2 | 601 | n/a | n/a |
| Go + htmx | none | no | none | 100.0% | 688 | yes | 0 | -9.9 | 621 | n/a | n/a |
| Laravel (PHP-FPM) | none | no | none | 95.0% | 7,008 | yes | 0 | 1.0 | 885 | n/a | n/a |
| Laravel (Octane, FrankenPHP) | none | no | none | 100.0% | 4,982 | yes | 0 | 6.0 | 1,334 | n/a | n/a |
| WordPress | none | no | none | 29.0% | 9,844 | **no** | 0 | -6.4 | 1,968 | 500 / 500 | 3,216 |
| WordPress (page cache) | none | no | none | 100.0% | 117 | yes | 0 | 9.1 | 1,798 | 200 / 200 | 1,958 |
| Ghost | none | no | none | 29.2% | 9,715 | yes | 0 | 221.9 | 4,582 | 200 / 500 | 2,504 |
| Ghost (proxy cache) | none | no | none | 100.0% | 123 | yes | 0 | -146.1 | 4,442 | 200 / 200 | 2,213 |

## Build, code and dependencies

| Target | Cold build s | Install s | Build s | Image MB | Output KB | Output JS KB | Source lines | Files | Direct deps | Packages | npm audit (prod) H/C | Trivy OS H/C | Trivy lang H/C |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| HTML + nginx | 2.0 | 0.0 | 0.0 | 92 | 622 | 0.0 | 5,180 | 48 | 0 | 0 | n/a | 3/0 | 0/0 |
| Hugo | 15.1 | 0.0 | 10.7 | 92 | 627 | 0.0 | 243 | 20 | 0 | 0 | n/a | 3/0 | 0/0 |
| Nuxt (SSG) | 23.9 | 8.8 | 6.9 | 96 | 1,493 | 218.0 | 501 | 27 | 3 | 600 | 0/0 | 3/0 | 0/0 |
| Nuxt (SSR) | 27.9 | 8.6 | 8.7 | 344 | – | – | 501 | 27 | 3 | 600 | 0/0 | 48/0 | 6/0 |
| Next.js (export) | 29.8 | 10.7 | 11.1 | 100 | 4,944 | 567.4 | 544 | 26 | 3 | 54 | 0/0 | 3/0 | 0/0 |
| Next.js (SSR) | 33.0 | 11.2 | 11.9 | 288 | – | – | 544 | 26 | 3 | 54 | 0/0 | 0/0 | 6/0 |
| Astro (SSG) | 18.1 | 6.4 | 2.6 | 92 | 629 | 0.0 | 352 | 20 | 3 | 296 | 0/0 | 3/0 | 0/0 |
| Astro (SSR) | 33.5 | 23.6 | 2.9 | 608 | – | – | 352 | 20 | 3 | 296 | 0/0 | 48/0 | 6/0 |
| SvelteKit (SSG) | 16.9 | 3.7 | 5.5 | 96 | 1,792 | 104.3 | 589 | 31 | 9 | 89 | 0/0 | 3/0 | 0/0 |
| SvelteKit (SSR) | 16.7 | 3.7 | 5.6 | 238 | – | – | 589 | 31 | 9 | 89 | 0/0 | 0/0 | 6/0 |
| React Router (prerender) | 15.6 | 5.4 | 3.6 | 94 | 2,125 | 363.3 | 671 | 24 | 12 | 218 | 0/0 | 3/0 | 0/0 |
| React Router (SSR) | 20.9 | 12.4 | 2.4 | 331 | – | – | 671 | 24 | 12 | 218 | 0/0 | 0/0 | 21/0 |
| Angular (prerender) | 27.1 | 10.1 | 9.7 | 93 | 1,595 | 591.6 | 796 | 29 | 16 | 436 | 0/0 | 3/0 | 0/0 |
| Angular (SSR) | 27.1 | 10.0 | 10.4 | 343 | – | – | 796 | 29 | 16 | 436 | 0/0 | 48/0 | 6/0 |
| Qwik City (SSG) | 19.9 | 6.4 | 7.6 | 97 | 2,536 | 99.7 | 999 | 32 | 9 | 326 | 0/0 | 3/0 | 0/0 |
| Qwik City (SSR) | 20.8 | 11.9 | 6.4 | 253 | – | – | 999 | 32 | 9 | 326 | 0/0 | 0/0 | 6/0 |
| Go net/http | 38.2 | 0.3 | 27.1 | 22 | – | – | 542 | 15 | 0 | 0 | n/a | 0/0 | 0/0 |
| Go + htmx | 38.2 | 0.3 | 27.1 | 22 | – | – | 542 | 15 | 0 | 0 | n/a | 0/0 | 0/0 |
| Laravel (PHP-FPM) | 20.6 | 3.8 | 0.2 | 267 | – | – | 1,914 | 62 | 1 | 74 | n/a | 3/0 | 0/0 |
| Laravel (Octane, FrankenPHP) | 32.0 | 6.8 | 0.1 | 310 | – | – | 1,914 | 62 | 1 | 74 | n/a | 0/0 | 1/0 |
| WordPress | 27.3 | 0.0 | 0.2 | 803 | – | – | 970 | 21 | 0 | 0 | n/a | 3/0 | 25/1 |
| WordPress (page cache) | 27.3 | 0.0 | 0.2 | 803 | – | – | 970 | 21 | 0 | 0 | n/a | 3/0 | 25/1 |
| Ghost | 75.7 | 0.0 | 0.2 | 2,340 | – | – | 606 | 25 | 0 | 0 | n/a | 3/0 | 133/4 |
| Ghost (proxy cache) | 75.7 | 0.0 | 0.2 | 2,340 | – | – | 606 | 25 | 0 | 0 | n/a | 3/0 | 133/4 |

## Implementation effort (AI agents, see methodology)

| App | Wall-clock min | Build-check-fix iterations | Deviations | Main friction |
|---|---:|---:|---:|---:|
| static-html | – | 1 | reference | Hand-written; 40 post files generated once from a template |
| hugo | 59 | 3 | none checked; tabs kept in code, heading ids | 0.169 renames (hugo.Data, locale), XML escaping, uglyURLs sitemap paths; minutes shared with go |
| go | 59 | 1 | filtered list renders hidden cards (vanilla); htmx keeps empty params in URL | Go 1.26 ServeMux redirects; minutes shared with hugo |
| sveltekit | 72 | 5 | none checked | Kit 3 moved config to vite.config, $lib to #lib; real 404.html needs a prerendered /404 route; searchParams forbidden in prerender |
| react-router | 79 | 2 | v8 instead of v7; 404/index.html renamed in Dockerfile | v8 API changes only visible under tsc; silent server start |
| angular | 60 | 4 | allowedHosts *; data-* hooks absent | no 404.html for ** route; base href vs skip link; fileReplacements per render mode |
| nuxt | 97 | 3 | post body duplicated in payload | experimental.prerenderErrorPages found in source; JSON error pages for non-HTML Accept; prerender routes leak into nuxt build |
| wordpress | 93 | 3 | wp-json/xmlrpc/login still answer; trailing-slash URLs 200 | tag is a reserved query var; root-relative asset filters; volume shadows theme; 13 head/feature removals |
| next | 139 | 4 | rewrite for notFound() in dynamic pages; /_not-found always prerendered | notFound() returns empty error shell; segment config cannot vary by mode; output: export rejects route handlers |
| qwik | 119 | 7 | post body serialized twice; framework attributes | adapter prerenders by default (ssg: null); lazy handlers needed sync$ for theme; RouterHead key leak |
| astro | 149 | 4 | none | @astrojs/rss trailing slash; @astrojs/sitemap lists only prerendered routes |
| laravel | 130 | 2 | session/CSRF middleware removed; hidden cards on filter | Blade inline directives after word chars; opcache stale views; starter assumes DB cache/session/queue |
| ghost | 143 | 8 | no server-side filtering; Ghost re-renders post HTML; nginx maps URLs and feeds | no custom fields (data via generated partials); trailing slashes; slow first boot; ghost_head injects CDN scripts |

