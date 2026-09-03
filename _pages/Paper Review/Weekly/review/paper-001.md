---

title: "[Cell Previews] Simplifying protein engineering with deep learning"

date: "2025-09-15"

thumbnail: "/assets/img/paper-001-01.webp"

---

# Why This Paper?

Paper Review, 그 중에서도 Weekly Study의 목적은 대학원 생활 동안 주기적으로 내가 관심을 가지거나, 교수님의 추천을 받은 논문들을 읽으며 분야의 큰 흐름을 발견하고, 궁극적으로 나만의 research field를 구체화하는 기반을 마련하는 것이다. 처음으로 읽기로 한 논문은 **Simplifying protein engineering with deep learning**이다. 내가 현재 가장 관심 있어하는 AI 기반의 protein engineering 분야에 속하는 짧은 논문이고, 교수님이 보내주신 것이라 선택해보았다.  

# About Paper

[**Simplifying protein engineering with deep learning**](https://www.cell.com/cell/fulltext/S0092-8674\(25\)00859-1) 이라는 이 논문은 Cell Preview에 게재된 짧은 논문으로, Cell 학술지에 게재된 학술 연구의 간략한 소개 형식이라고 볼 수 있다. 저자들인 Kevin K. Yang과 Ava P. Amini는 미국 Cambridge에 위치한 Microsoft Research의 연구자들로, google scholar 기록을 보니 Kevin이라는 연구자는 computation-based protein engineering 관련 연구를 아주 많이 하지는 않았지만, 꾸준히 해오고 있는 것으로 보인다. 

소개하고 있는 두 논문은 다음과 같다.
- [Advancing protein evolution with inverse folding models integrating structural and evolutionary constraints - ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0092867425006804)
- [Iterative recombinase technologies for efficient and precise genome engineering across kilobase to megabase scales - ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0092867425008001)

# Main Points

1) Deep learning을 활용한 protein engineering의 강점은 simplicity에 있다. 
2) *Cell* issue에서, Caixia Gao와 collegues는 현재 존재하는 fixed-backbone sequence design model들을 잘 deployment (전개)하여 diverse genome editing system을 설계하였다. 특별히 이 system은 functionality를 향상시켰고, 소규모의 fine-grained부터 large-scale genome editing까지 강력한 capability를 가진다. 
3) System은 strong experimental validation을 통해 demonstrated 되었다. 

> (Cons in traditional protein engineering; **directed evolution**): "...However, experimental screens are time- and resource-intensive, and simple methods to maximize sequence diversity waste experimental effort on non-functional sequences..."  

곧 `Extend Backgrounds`에서 자세히 다루어볼 예정이지만, directed evolution의 경우 결국 인공적으로 다양한 mutations을 많이 만들고, 그중 원하는 특성에 가까운 것을 골라내어 evolution을 모방하는 형태라서 위에서 말하는 것과 같이 non-functional sequences에 대한 screening에 많은 노력이 든다.  
AI-based protein engineering도 유사한 문제점을 가지게 된다. 결국 인위적으로 생성하거나 조작하기 때문에 screen이 아닌 **validation**이 필요하게 된다. 즉, 조금 더 복잡한 모델링을 통해 classical method에서 100개 정도 검증할 것을 1개로 줄여준다고 하지만, 결국 experimental validation이 필요하다는 관점을 공고히 하기 위해서 이 paper를 읽고 있는 것이라고 볼 수 있겠다. 

# Main Texts

## Cons: Directed Evolution

Protein engineering의 목표는 protein이 improved function을 가지도록 optimize and design하여, human therapeutics, metabolic engineering, genome editing 등에 사용하는 것이다. 이러한 관점에서 directed evolution methods는 iterative한 sequence diversity 생성과 screening에 기반해서, 실험실 내에서 성공적으로 protein sequence-function의 복잡하고, 비선형 (non-linear)의 landscape에서 improved sequences를 찾을 수 있도록 했다. 다만 앞서 언급했듯, 이 과정에는 몇 가지 단점이 존재한다.  

## Importance of Validation of AI methods

이러한 배경에서, 최근에는 general-purpose datasets을 large-scale에서 학습한 AlphaFold, ProteinMPNN, RFdiffusion 같은 foundational AI methods들이 등장했다. 결국 목적은 protein을 더 잘 이해하고, 디자인할 수 있는 능력을 얻는 것이다. 

다만, 본 논문에서 주목하고 있는 것은 큰 잠재성을 가지고 있는 AI model들의 실질적인 검증 (validation)이다. 더 정확하게는 아래와 같은 질문이다. 
> "How can these models be deployed, and what applications can they reasonably empower, especially without modification?"

나도 저자들의 관점을 경험적으로 느껴본 적이 있다. 최근에 이 분야를 이끌고 있는 곳 중 하나인 David Baker 교수님의 연구실에서 낸 Computational Design of Serine Hydrolases라는 논문을 읽던 중이었다. 아직 학부생인 내 입장에서 논문의 초반부를 읽던 중, 어려운 부분이 많아서 논문의 1저자인 Anna Lauko와 Sam Pellock이라는 연구자가 직접 연구 내용을 설명하는 [영상](https://www.youtube.com/watch?v=wdbDo9FQ4ns)을 보았다. 여기서도 ProteinMPNN, RFdiffusion 등 여러 가지 methods를 사용하여 새로운 serine hydrolase를 design 했지만, 실제 enzyme의 효율은 자연에 존재하는 것에 비해 아쉬움이 있던 것으로 기억한다. 이걸 보면서 아직 이 분야에서 근본적인 breakthrough가 더 필요한 것 같다는 생각을 했었다.  

## Example Answers in *Cell* Papers

### Previous Strategy

EvolvePro 같은 foundationally trained protein model은 실제 실험 데이터에 fine-tuned 되어서, directed evolution loop에서 기능을 향상시킬 수 있는 amino acids를 예측하는 것에 사용되었다. 다만, 이 방법은 specific한 training data를 만들어야 하고, 많은 계산 자원과 expertise가 필요하다는 단점을 가진다. 

### Gao and collegues' Strategy

이들이 광범위한 실험적 validation을 기반으로 주장한 것은 **fixed-backbone sequence design models로부터 high-confidence sampling을 진행하면, 모델이 아무런 specific function or fitness에 대한 정보를 얻지 않고도, 종종 더 specific function에 더 나은 protein variants를 얻을 수 있다**는 것이다.  

**Fixed-backbone sequence design model?**  
: ProteinMPNN과 같이 "inverse folding" 문제를 푸는 모델을 의미한다. 생물학에서 오랜 기간 중요한 문제였던 서열이 주어졌을 때 구조를 예측하는 문제의 역으로, 아미노산의 carbon backbone만 주어졌을 때 그 구조를 형성할 것 같은 서열을 예측하는 것이다.  
: 참고로 실제 ProteinMPNN을 사용해보니 주어진 구조에서 서열을 생성할 때 sampling의 sharpness를 결정하는 temperature (τ) 값을 매우 작은 값부터 순차적으로 선택할 수 있었는데, 매우 작은 값을 선택하면 high-confidence sampling이라고 볼 수 있을 것 같다. 

### First Paper (for fine-grained)

첫 논문에서 Fei라는 연구자를 비롯한 저자들은, fixed-backbone sequence design model들을 "AI-informed constraints for protein engineering" (AiCE), 즉 inverse folding model이 생성하는 서열을 높은 fitness를 가진 sequence variants를 지정하기 위해서 사용했다. 방법은 다음과 같다:
1) ProteinMPNN을 이용해서 protein of interest의 구조의 backbone structure에 구조적으로 compatible한 아미노산 서열을 많이 샘플링한다. 
2) 서열 상 각 위치에서 가장 자주 발견된 amino acid substitution을 결정하고, 이 치환율과 추가적인 structural, evolutionary guidance를 기반으로 가장 기능을 향상시킬 것 같은 돌연변이를 확인한다. 
결과적으로 저자들은 base editing (A -> G, C -> T...)만 신경을 써서 8개의 크고 복잡한 단백질에서 효용을 확인하였다고 한다. 

이 간단한 시스템은 single nucleotide editing 수준의 정확도로, AiCE는 adenine과 cytosine base editor 중에 더 잘 작동하는 improved-fitness variants를 찾아 base-editing window를 줄여주고, off-target effect를 최소화하고, on-target/off-target의 비율을 높여 specificity를 증가키시고, 이전에 어렵던 subcellular context에서도 일반화가 가능해서 mitochondrial DNA 같은 이중가닥의 editing도 가능하게 하는 등 다양한 효과를 보인다. 

Classical method와 비교해서 성능을 비교할 수 있는 결론은 다음과 같다.
> "Each AiCE base editor campaign (실험) required only one round of screening approximately a hundred proposed variants to identify improved proteins."

### Second Paper (for large-scale)

두 번째 논문에서는, editing을 large-scale로 확장하여 Cre DNA recombinase system을 이용한 kilo~megabase 수준의 편집을 목표로 하였다. 

**Cre DNA recombinase system?**  
: P1 bacteriophage에서 유래된 tyrosine recombinase로, 특정 서열에 반응하여 topoisomerase 1과 유사한 재조합을 수행한다. 

Sun이라는 연구자를 비롯한 저자들은 AiCE framework를 multimer 형태로 작동하는 recombinase에 맞추어서, 상당히 향상된 효율성을 가진 Cre recombinase의 variant를 engineer 했다. 구체적으로 AiCE에 향상된 Cre variant와 high-throughput (고속) molecular engineering techniques를 이용해서, intergration/inversion/deletion/translocations 등 large segment of DNA를 다룰 수 있는 large-scale recombination capability를 얻었다.  

실제로 이 programmable recombinase-driven platform을 작물 식물에 적용하는 것을 통해서 multi-gene stacking (다수의 gene을 동시에 삽입)할 수 있는 것을 입증하고, plant genome engineering에 강력한 도구가 될 수 있음을 보였다. 

> "At its core, AiCE is a mutation design framework that nominates potential high-fitness variants by sampling amino acid sequences from pre-existing inverse folding models, leveraging their encoded evolutionary and structural information."

결국 AiCE가 하는 일은, **evolutionary and structural information을 이용해서 fitness를 향상시킬 것 같은 mutation을 제안하던 과거의 연구들의 연장선**이 된다 (e.g. MSA to find consensus mutations, library design such as site-saturation mutagenesis that improve function without destabilizing the protein).  

하지만 다른 점은, pre-trained deep learning model을 이용해서 연관된 서열만이 아닌 알려진 모든 서열과 구조의 다양성에서 고려될 수 있는 상호작용까지 반영하여, suggested variants를 improve할 수 있다는 것이다.  

## Conclusions

하지만, AiCE의 주요한 한계는 여전히 known structure라는 functional starting point를 필요로 한다는 점이다. 저자들은 *de novo* protein design methods를 통해서 structure space든, sequence space든, 혹은 둘 다에서 충분히 강력하고 starting point를 필요로 하지 않는 미래를 상상할 수 있다고 본다. 이를 기반으로 우리는 아마 향상되거나 완전히 새로운 기능을 가진 generative design of new, synthetic protein을 얻을 수 있을 것이다.  

>"...we must critically test and demonstrate their real-world utility for biological applications that matter. ...Rather than developing a bespoke new method, they cleverly leverage a pre-existing method, fixed-backbone sequence design, and deploy it well to empower successful protein engineering campaigns for genome editing systems."


## Comment

이 논문을 읽어보니, 한 번쯤 여기서 소개된 first paper 같은 걸 읽어보고 구현해볼 수 있지 않을까 하는 생각이 들었다. 물론, second paper 같이 recombinase를 결합한 system을 설계하는 것은 복잡해 보이지만... 결과적으로 최근 생각해보고 있는 protein design과 genome editing 분야에 대해 가능한 하나의 underlying idea를 배우는 좋은 기회였다고 생각한다. 