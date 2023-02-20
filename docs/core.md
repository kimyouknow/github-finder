# Core 만들기

## 목표

- 관심사가 분리된 함수형 core 만들기
- vanilla로 만들면서 dom 조작 및 event 조작에 대해 공부

## 구체화

> 비즈니스 로직과 뷰 로직을 분리하기

### 흐름

```md
dom 렌더링 -> 이벤트 등록 -> 이벤트 발생 -> 상태 변경(local, server) -> dom 렌더링
```

### view

- dom을 생성하는 부분(dom렌더링 함수)
- 중첩된 dom구조에서 가독성 좋게 사용 가능해야한다.
- 데이터 상태가 변경될 때 쉽게 렌더링되어야한다.

### event

- event 등록을 어디서 할지
  - view를 렌더링할 때 등록 vs 별도로 등록
- service에서 상태 변경
  - event handler와 구분된 상태 변경 로직
- view 렌더링
  - event 발생 -> 상태 변경 -> 새로운 view 렌더링

### service

상태 변경(local, server)

## 관심사 분리

- route.js
- html(redner)

## html 접근성

접근성 확인 방법

- html liveing standard
- headingsMap
- lighthouse

dl, dt
