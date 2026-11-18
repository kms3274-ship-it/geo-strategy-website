# 김명선 GEO 전략 홈페이지 — 운영 프로젝트

## 이번 프로젝트의 구성
- 원본 홈페이지의 주요 디자인과 프로필 사진을 유지하면서 소개 문구·산업별 GEO 메뉴·모바일 메뉴 개선
- GEO 인사이트: 독립 주소를 가진 칼럼 3편과 전체 목록. 새 글 작성 시 자동으로 목록에 표시
- Pages CMS 설정 파일 `.pages.yml` 제공: GitHub 로그인 후 브라우저에서 칼럼 편집 (서비스 연결은 별도)
- Netlify Forms 상담 신청 폼 (배포 후 Netlify 관리자에서 이메일 알림 별도 활성화 필요)
- robots.txt, 페이지별 메타 설명, canonical, Article/Organization 구조화 데이터

## 첫 배포 전 꼭 확인할 것
1. GitHub에 **새 비공개 또는 공개 저장소**를 만들고 이 ZIP의 압축을 푼 **폴더 안 파일 전체**를 업로드합니다. ZIP 자체를 업로드하지 마세요.
2. Netlify의 기존 사이트 > Project configuration > Build & deploy > Continuous deployment에서 GitHub 저장소를 연결합니다. 기존 사이트를 덮어쓰기 전에 Netlify에서 현재 배포본을 백업하고, 가능하면 Deploy Preview로 먼저 확인하세요.
3. 빌드 명령은 `npm run build`, 게시 폴더는 `dist`입니다. Node 22 사용.
4. https://pagescms.org 에 GitHub 계정으로 로그인하고 저장소 접근을 승인합니다. 해당 저장소의 `.pages.yml` 설정을 읽어 칼럼 관리 화면을 제공합니다. Pages CMS는 별도 제3자 서비스이며, 사용 조건과 접근 권한을 확인하세요.
5. 글을 저장하면 GitHub에 변경 사항이 반영되고, Netlify의 Git 연동이 정상이라면 자동으로 새 버전이 배포됩니다. 배포 성공을 확인하세요.
6. Netlify > Forms 에서 `consultation` 폼이 수집되는지 테스트하고, Forms > Form notifications에서 `kms3274@gmail.com`으로 이메일 알림을 설정하세요. 무료 플랜의 사용량 제한을 확인하세요.
7. Google Search Console, 네이버 서치어드바이저에서 사이트 소유권 확인 후 `https://hospitalgrowthstrategy.netlify.app/sitemap.xml` 제출하세요.
8. 독립 도메인을 연결한 뒤 `https://hospitalgrowthstrategy.netlify.app`이 들어간 canonical, schema, robots.txt를 새 도메인으로 바꾸고 사이트맵을 재제출하세요. 현재 예시 도메인은 기존 Netlify 주소입니다.

## 새 칼럼 작성 주의
Pages CMS에서 새 글을 만들 때 **tags = posts**, **layout = article.njk** 값이 유지되어야 합니다. 새 글의 파일명은 영어 소문자와 하이픈으로 지정하는 것이 좋습니다. 기본 퍼머링크는 `/insights/파일명/`입니다. 기존 예시 글의 permalink 필드는 그대로 두세요.

## 중요 제한
- **현재 실서비스는 변경되지 않았습니다.** GitHub/Netlify/Pages CMS 로그인 및 연결은 계정 소유자가 직접 승인해야 합니다.
- Netlify Forms는 Netlify 배포 뒤 실제 접수 시험을 해야 합니다. 로컬 미리보기에서는 제출되지 않습니다.
- 개인정보 처리방침, 수집 항목·보유기간·삭제 절차는 실제 운영 정책에 맞게 확정해 별도 페이지로 고지하는 것이 바람직합니다.
- 검색 노출 및 AI 인용은 보장되지 않습니다. 의료 관련 콘텐츠는 관련 법규와 전문가 검토가 필요합니다.
