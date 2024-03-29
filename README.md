# Github Finder

[배포 주소](https://kimyouknow.github.io/github-finder/)

## 목표

[Github Open API - Search](https://docs.github.com/ko/rest/search?apiVersion=2022-11-28)를 활용한 검색 서비스

## 기술 문서

- [x] : ⭐️ [vanilla front end architecture](docs/core.md) - 현재 적용한 구성과 단점
- [x] : ⭐️ [커스텀 html](docs/html.md)
- [x] : [최적화(debounce, throttle)](docs/optimize.md)
- [x] : scss
- [x] : [트러블 슈팅](docs/trouble-shotting.md)
- [ ] : fetch util

## 기능 구현

- [x] : profile finder
- [ ] : code finder
- [ ] : topics
- [ ] : repos

### 검색창 기능 구현

#### 검색창 핵심 기능

- [x] : 연관 검색어 자동 완성
- [x] : 최근 검색어 기록
- [x] : 선택한 키워드 활성화 (마우스, 키보드)
- [x] : 키워드 더블클릭 시 검색
- [x] : 키워드 키보드 엔터 시 검색
- [x] : 최근 검색어 삭제 및 전체 삭제

#### 자동완성(Auto Complete)

- [x] : (키보드 이벤트가 일어나면) 입력할 때마다 관련 검색어 자동 완성
- [x] : 자동 완성하면서 하이라이트
- [x] : 키보드 이동(맨 아래로 갔을 때 되돌아가기)
- [x] : 키보드 이동 중간 엔터 눌렀을 때 검색되게 하기
- [x] : 이동할 때마다 검색창에 반영(자동완성 목록은 변하지 않음?)

https://user-images.githubusercontent.com/71386219/225251005-68918b17-8b55-45c7-be49-f0456f71b145.mov

#### 최근 검색 기록(History)

- [x] : input창이 활성화되면 최근 검색 기록 보여주기
- [x] : 검색창에 아무것도 입력하지 않은 상태에서 방향키 입력시 최근 검색 기록창 활성화
- [x] : 개별 삭제
- [x] : 전체 삭제
- [ ] : 최근 검색 기록 끄기
- [ ] : 최근 검색 기록 끈 상태 -> 검색어 저장 기능이 꺼져 있습니다.
- [ ] : 최근 검색 기록 켠 상태 -> 최근 검색 기록이 없습니다.
- [x] : 키보드 이동(맨 아래로 갔을 때 되돌아가기)
- [x] : 키보드 이동 중간 엔터 눌렀을 때 검색되게 하기
- [x] : 검색날짜(mm-dd)

https://user-images.githubusercontent.com/71386219/225252482-d44c0b84-2d73-4428-914e-33f7a966ada7.mov

최근 검색어 삭제 및 전체 삭제

https://user-images.githubusercontent.com/71386219/225251645-c48324fa-b5f2-4229-a3b3-56eb2ad3a38c.mov

#### 기타

- [ ] : 검색 쿼리 url 상태로 반영

## 로컬 실행방법

```shell
$ npm install && npm run dev
```
