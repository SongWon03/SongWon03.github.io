---

title: "[PLOS One] Assesment of generative de novo peptide design methods for G protein-coupled receptors"

date: "2026-09-02"

thumbnail: "https://journals.plos.org/plosone/article/figure/image?size=large&id=10.1371/journal.pone.0355549.g001"

---

# About Paper 

Weekly Study에서 세 번째로 다루어 볼 논문은 [**Assesment of generative *de novo* peptide design methods for G protein-coupled receptors**](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0355549)이다. 이 논문은 최신 논문들 중, 내가 석박사통합과정 중 첫 번째로 진행하고 있는 연구와 비슷한 점이 많아 읽게 되었다. 이 논문을 통해 내가 가장 알고 싶었던 것은 나랑 비슷한 연구를 한 연구자들이 어떤 분석을 했고, 어떻게 scientific knowledge를 도출하여 논문으로 풀어내는가 였다.  
<br>
이 논문은 2026년 4월쯤 BioRxiv에 공개되었고, 2026년 8월 27일에 PLOS One에 게재되었다. 논문의 교신저자인 Clara Schoeder 교수님은 독일 Leipzig 대학의 medical faculty이자, Institute for Drug Discovery에 소속되어 있다. 신약 개발, 머신/딥러닝을 활용한 신규 단백질 디자인, SARS-CoV-2, GPCR, Antibody 등 다양한 주제를 활발하게 연구하고 있다. 주저자인 Hnnes Junker 교수님 역시 동일 소속이다.  
<br>


# Highlights 

- GPCR-peptide의 알려진 unique한 구조 113개를 3개의 구조 예측 도구 (`AlphaFold2InitialGuess`, `Boltz-2`, `RosettaFold3`)로 예측하여 펩타이드 구조 예측 성능을 benchmark 하였음. 
- 구조 예측 모델의 예측 성능이 seed 의존적이고, true/false를 구별하기에 적절한 confidence score가 peptide pLDDT와 interaction-PAE라는 것을 DockQ-confidence correlation 분석을 통해 보였음. 
- 3가지 대표 GPCR-peptide complex에 대해 3개의 서열 생성도구 (`BindCraft`, `BoltzGen`, `RFdiffusion3`)를 이용해 10000개의 design을 각각 생성하여 각 도구의 특징을 확인하였음. 
- 90개의 그럴듯한 peptide design을 다시 3개의 구조 예측 도구로 예측하여 DockQ를 확인하고, `ProteinMPNN`을 이용한 서열 샘플링이 조금 더 구조에 최적화된 서열을 만들 수 있음을 제안하였음. 


# 1. Introduction

AlphaFol2의 등장 이후, deep learning에 기초한 computational structural biology가 빠르게 발전하면서 의약품(pharmaceutical) 개발에 대한 수많은 접근이 생겨났다. Biomolecular complexes prediction 분야에서는 AlphaFold3, Boltz-2, Chai-1, RosettaFold3 같은 모델들이 등장했다. 한편, protein design 분야에서는 신규(*de novo*) 단백질을 원자 수준 정확도로 디자인할 수 있는 RFdiffusion, BindCraft, RFdiffusion3, Chai-2, BoltzGen 같은 도구들이 등장했다. 새롭게 개발된 도구들은 주로 RFdiffusion1/2 계열의 workflow인 `backbone generation` &rarr; `inverse folding` &rarr; `structure prediction`와는 달리, backbone과 sequence 생성을 동시에 하는 형태로 변화하고 있다 (e.g. BoltzGen, RFdiffusion3).  
<br>
Therapeutics 분야에서는 protein design 도구들을 이용해서 꾸준하게 peptide design을 시도하고 있다. 주로 크기가 50 residues 혹은 그 이하로 정의되기 때문에, 생체 내에서 toxicity가 낮고 selectivity가 높아 관심이 계속 커지고 있는 상황이다. 다만 peptide는 binding 전에는 disordered structure를 가지거나 약한 short $\alpha$-helical stretch 혹은 $\beta$-hairpin으로 안정성을 가지다가, 다른 단백질과 interaction하면서 구조가 크게 바뀌기 때문에 구조 예측 모델이 어려워하는 task중 하나로 생각된다.  
<br>
저자들은 특히 G-protein coupled receptor (GPCR)에 주목했다. GPCR은 human genome내의 membrane protein 중 가장 큰 group이다. 이중 체내에서 발생하는 신호 전달에 관여하는 non-sensory GPCRs의 30%가 hormones, growth-factors or neurotransmitters로 작동하는 peptides에 의해 활성화된다. GPCRs는 highly conserved 7 transmembrane helical bundle로 구성되어 있고, extracelluar pocket에 존재하는 orthosteric binding site (효소 등의 원래 결합 부위)와 ligand가 결합하면 allosteric cascade를 통해 intracellular G protein binding site를 열어 signaling에 관여할 수 있다. 특히 GPCRs에 대한 *in silico* design이 어려운 이유는 1) orthosteric pocket이 매우 tight하고, 2) endogenous peptide가 receptor에 대해 매우 선택적이라 서열 composition/charge/backbone 등이 조금만 변화해도 extracellular binding site와 intracellular G protein binding site 간의 allosteric communication을 막기 때문이다.  
<br>
따라서 저자들은 본 연구를 통해 **generative design model이 GPCRs 같은 small pocket target에 적절한 peptide candidate를 샘플링 할 수 있는지, 그리고 구조 예측 모델의 confidence score가 적절한 candidate와 부적절한 candidate를 구분할 수 있는지를 benchmarking하고자 하였다.**  
<br>
![](https://journals.plos.org/plosone/article/figure/image?size=large&id=10.1371/journal.pone.0355549.g001)
**Fig 1.Schematic overview of the two-part benchmark.**   
<br>

구조 예측 모델로는 templating이 가능한 3가지 모델 (`AlphaFold2 Initial Guess (AF2IG)`. `Boltz-2`, `RosettaFold3 (RF3)`)을 이용하였다. 이 모델들은 template로 receptor인 GPCR의 구조를 고정할 수 있으므로, peptide 구조 예측 능력을 비교할 수 있도록 해준다. 이후 3가지의 대표 peptide-receptor complexes를 대상으로, 3가지의 생성형 모델 (`BindCraft`, `BoltzGen`, `RFdiffusion3`)을 활용해 각각 10,000개의 peptide candidate를 생성하였다. 특히 이들은 `ProteinMPNN` 같은 inverse folding 도구를 사용하지 않고, 스스로 backbone 구조와 서열 샘플링을 수행할 수 있는 generative design model만을 활용하여 생성 능력을 orthogonal하게 교차검증할 수 있었다.   
<br>

# 2. Results

## 2.1 Collection of GPCR-peptide complexes

![](https://journals.plos.org/plosone/article/figure/image?size=large&id=10.1371/journal.pone.0355549.g002)
**Fig 2. Dataset distribution**  
<br>

저자들은 가장 먼저 `AF2IG`, `Boltz-2`, `RF3`의 3가지 구조예측 모델이 GPCR-peptide complex의 binding mode를 예측할 수 있는지 평가하고자 하였다. 따라서 GPCRdb로부터 복합체 구조를 모은 뒤, 중복/non-canonical amino acids 등을 제외한 113개의 unique GPCR-peptide dimer를 얻었다. **Fig 2.A**에서 보이는 것처럼 GPCRs의 특징 중 하나는 promiscuity (혼잡성)이다. 즉, 하나의 receptors에 대해 여러 개의 ligands가 결합하거나 그 반대가 가능한 many-to-many binding relation between GPCRs & endogenous peptides의 특징을 가진다. 

**Note:** 일반적인 peptide의 길이는 50 residues 이하이지만, 여기서는 4 nanobodies와 protein ligand도 peptide와 binding mode가 비슷했기 때문에 포함하고 논문에서는 peptide로 포함하기로 하였다.  
<br>

## 2.2 Benchmarking prediction of GPCR-peptide complexes

수집한 113개의 구조들을 대상으로 저자들은 `AF2IG`, `Boltz-2`, `RF3`가 원래 구조를 얼마나 잘 예측하는지 평가하였다. 이때 receptor에 해당하는 GPCR의 구조는 template로 입력하였고, de novo peptide prediction의 상황을 가정하기 위해서 multiple sequence alignments (MSAs) 정보 없이 구조를 예측시켰다. 각각의 complexes는 각 모델마다 50개의 서로 다른 seed를 이용하여 여러 번 예측하였다. 예측 이후에는 template를 기준으로 구조를 superimpose한 뒤, natural peptide인 reference structure와 예측된 peptide structure와의 구조적 차이를 DockQ score를 통해 평가하였다.  

**DockQ:** 0~1 사이의 값으로 표현되는 단백질 구조 예측 모델의 정확도 지표로, fraction of retrieved native contacts ($F_{nat}$), LRMS (for Ligand), IRMS (for interface)의 값을 반영하고 있음. 값에 따라 아래와 같이 discrete하게 예측의 quality를 분류할 수도 있음. 
- `incorrect`: DockQ < 0.23
- `acceptable quality`: 0.23 ≤ DockQ < 0.49
- `medium quality`: 0.49 ≤ DockQ < 0.8
- `high quality`: 0.8 ≤ DockQ  
<br>

## 2.3 Peptide predictions were seed- and training cutoff-dependent

![](https://journals.plos.org/plosone/article/figure/image?size=large&id=10.1371/journal.pone.0355549.g003)
**Fig 3. Collective structural deviation of 50 predictions per prediction method of all 113 receptor-peptide complexes.**  
<br>

**Fig 3**에서 확인할 수 있듯이, 113개의 GPCR-peptide complexes에 대해서 `AF2IG`는 원래 구조를 제대로 예측하지 못했다(낮은 DockQ score, 높은 RMSD). 그에 비해 `Boltz-2`와 `RF3`는 훨씬 좋은 결과를 보였지만, 3가지 도구 모두 ligand의 size가 클수록 예측 정확도가 떨어졌다. 내 연구에서 하나 참고할 만한 점은 <mark>cyclic & linear peptide에서 DockQ score의 유의미한 차이가 없다는 것</mark>이다.  
<br>

![](https://journals.plos.org/plosone/article/figure/image?size=large&id=10.1371/journal.pone.0355549.g004)
**Fig 4. DockQ scores stratified by training set inclusion**  
<br>

다음으로 저자들은 구조 예측 모델의 성능이 학습 데이터 내에 포함 유무에 따라 달라지는 지 확인하였다. 각 구조 예측 모델의 출시일은 `AF2IG` (2021/10/30), `Boltz-2` (2023/01/06), `RF3` (2024/01/01)이고, PDB 구조의 ID 혹은 다른 ID이지만 동일한 구조의 release date를 기준으로 예측 모델 출시일 전이면 `pre cufoff`, 후면 `post cufoff`로 분류해 예측 성능을 비교하였다. 그 결과는 **Fig 4**에서 확인할 수 있는데, 특히 `AF2IG`가 `high quality` DockQ score로 예측할 확률이 15.8%에서 3.2%로 크게 감소하였다. 이 차이는 가장 늦게 나온 `RF3`에서 가장 적었는데, 나는 이를 상대적으로 많은 단백질이 학습 데이터에 포함되었기 떄문으로 생각한다. 

추가로 구조 예측 모델의 DockQ 점수는 seed에 의존적이었다고 한다. `AF2IG`의 경우 동일한 구조에 대해서 seed에 따라 DockQ 점수가 0.03 ~ 0.85까지도 차이났다. `Boltz-2`의 경우는 대부분의 peptide에 대해서 seed에 따른 넓은 DockQ score spread를 보였다. 즉, GPCR-peptide의 경우는 일반적으로 많은 seed를 이용해 구조 예측을 하면 `Boltz-2`로부터 나오는 DockQ score가 제일 높은 경향이 있다는 것이다.  
<br>

![](https://journals.plos.org/plosone/article/figure/image?size=large&id=10.1371/journal.pone.0355549.g005)
**Fig 5. DockQ scoring distribution over 50 predictions for each of the 113 receptor-peptide pairs and for each prediction method (red: AF2IG, orange: Boltz-2, green: RF3), sorted by length of the ligand.**  
<br>

물론 3가지 구조 예측 모델이 잘 예측하는 peptide-receptor complex, 즉, 각 모델의 강점은 다르다(**Fig 5**).  
<br>

## 2.4 Prediction confidence scores weakly correlate with structural deviation

3가지의 구조 예측 모델들이 GPCR-peptide complex 구조를 `no MSA` 조건에서 예측할 수 있다는 것을 확인한 후에, 저자들은 protein design 분야에서 관용적으로 활용하는 `pLDDT (predicted Local Distance Difference Test)`, `PAE (Predicted Aligned Error)` 및 그 하위 집합으로 계산되는 confidence score들이 정확히 예측된 것과 그렇지 않은 peptides를 구별할 수 있는지 확인하고자 하였다. 저자들이 확인한 score를 정리하면 아래와 같다.  

- **peptide chain pLDDT (predicted Local Distance Difference Test)**
- **intra-chain PAE (or PAE peptide)**
- **inter-chain PAE (or iPAE)**
- **$ipSAE_{min}$**: only for interface
- **$ipSAE_{max}$**: only for interface  
<br>

![](https://journals.plos.org/plosone/article/figure/image?size=large&id=10.1371/journal.pone.0355549.g006)
**Fig 6. PAE based confidences compared to DockQ scores by method for all predictions.**  
<br>

저자들은 앞서 예측한 113개 복합체 예측 결과를 가지고, PAE를 통해 계산되는 confidence score들과 DockQ score간의 상관관계를 계산하였다(**Fig 6**). 즉, 상관성이 높다면 confidence score가 실제 구조와 가까운 예측과 그렇지 않은 예측을 구별하는데 활용하는 것이 적절하다는 의미가 된다. 이 부분의 핵심 결과는 **iPAE**는 `AF2IG`와 `RF3`에서 DockQ의 상관계수가 높으므로, 두 모델을 통해 정답을 구별할 수 있는 confidence score로 생각할 수 있고, **peptide chain average pLDDT**는 `Boltz-2`와 `RF3`에서 높은 상관계수를 보이므로, 이 두 모델을 통해 결과를 구별할 수 있는 confidence가 된다는 것이다. 추가로 **PAE, ipSAE**의 경우는 정답과 오답에서 거의 구별할 수 없는 값이 나온다는 것을 확인하였다. 즉, <mark>GPCR-peptide complex의 경우에는 하나의 구조 예측 모델만 사용한다고 가정할 경우 RF3를 이용해 pLDDT, iPAE로 정답 후보를 구별하는 것이 괜찮은 방법이 될 수 있다는 것</mark>이다. 추가로 참고할만한 점은 <mark>이러한 특이적인 구조에서는 interchain pair의 10Å 이내의 PAE만 봐서는 정답과 오답을 구별할 수 없다는 점</mark>이다.  
<br>
다만 동일하게 **Fig 6**에서 볼 수 있듯이, 만약 여러 개의 seed를 통해 구조를 예측한 후 가장 좋은 confidence score를 기준으로 DockQ correlation을 구한다면, **pLDDT** 및 **$ipSAE_{min}$** 과 DockQ 상관성이 증가할 수 있었다(반대로 다른 confidence의 상관성은 감소한다).  
<br>

## 2.5 Prediction diversity illustrated by Endothelin receptor complexes with different peptides

![](https://journals.plos.org/plosone/article/figure/image?size=large&id=10.1371/journal.pone.0355549.g007)
**Fig 7. Different Endothelin receptor type B ($ET_{B}$) peptides as example for the discrepancy between DockQ variance and confidence.**  
<br>

이전의 결과에서는 각 모델에 적합한 confidence score의 경향성을 보여줬지만, 모든 경우에 적용할 수 있는 특징은 아니다. 저자들은 GPCR 중에서 여러 개의 구조적으로 동일하지만 다른 서열을 가지는 Endothelin receptor type B ($ET_{B}$)를 예시로 들었다. $ET_{B}$는 **Fig 7.A**에서 볼 수 있듯이, 구조적으로는 동일하지만 서열은 조금씩 다른 cys-cys cyclic peptide이다.  

동일한 구조에서 서열만 바뀐 $ET_{B}$의 경우에서도, 각 구조 예측 모델은 예측 정확도가 차이났고 (DockQ) 동시에 iPAE와 DockQ 상관성의 패턴도 바뀌었다. 즉, <mark>mimotope의 경우는 하나의 target receptor에 대해서도 peptide 서열에 따라 모델의 예측 성능이 매우 달랐고, 완벽히 정답을 예측하는 경우와 그렇지 않은 경우에 iPAE의 값이 별로 차이나지 않기 때문에 iPAE가 항상 정답과 오답을 잘 구별할 수는 없다는 것이다. 그래도 정확한 구조 예측 유무를 떠나 다행인 것은 대부분 functional한 서열에 대해서는 iPAE의 상한선이 존재한다는 것이다. 
그래서 내 생각에는 만약 이 iPAE의 분포를 functional한 서열과 아닌 서열에 대해 구별해서 확인해본다면 좀 더 가치있는 insight를 얻을 수 있을 것 같다. </mark>  
<br>

## 2.6 Comparing the sampling of BindCraft, BoltzGen and RFdiffusion3

마지막으로 저자들은 `BindCraft`, `BoltzGen`, and `RFdiffusion3`의 3개 도구를 이용해서 
1) Angiotensin II receptor type 2 (AT${_2}$) receptor with its endogenous peptide Ang II (8 residues)
2) Endothelin receptor type B (ET${_B}$) in complex with Sarafotoxin S6b (22 residues) 
3) Nociceptin (NOP) receptor in complex with its endogenous Nociceptin peptide (14 residues)  

의 3가지 target complex에 대해 10,000개의 designs를 생성하였다. 저자들은 binding pocket-intruding peptide terminus와 가장 가까운 4~6개의 residue를 hotspot으로 사용하였고, 원본 peptide를 mimic하기 위해서 서열의 길이를 원본과 동일하게 유지하였다. 저자들은 아래의 두 가지 scoring fucntion을 통해서 GPCR design에서 흔하게 발생하는 문제인 **hotspot과 가깝지만 transmembrane region에 붙는 error**를 filtering하였다.  

1) 모델에 제공한 hotspot과 designed peptide 간의 거리 (functionally related residue와 결합할 만큼 충분히 deep pocket에 들어갔는지)
2) 생성한 peptide와 native peptide 사이의 전반적인 구조 다양성을 측정하는 C$\alpha$-RMSD   
<br>

![](https://journals.plos.org/plosone/article/figure/image?size=large&id=10.1371/journal.pone.0355549.g008)
**Fig 8. Structural assessment of 10000 generated peptides for each target receptor with each method.**  
<br>

위와 같은 두 가지의 방법과 Orientations of Proteins in Membranes (OPM) database를 통해 생성 complex를 실제와 유사한 위치에 정렬한 결과, 저자들은 GPCRs의 binding pocket에 알맞게 들어간 후보 서열들을 얻을 수 있었다. 각 generative tool로 생성한 결과 분포 (**Fig 8**)를 살펴보면, 특히 `RFdiffusion3`에서 C$\alpha$-RMSD의 분포가 다양하게 나타나므로 구조적으로 다양한 peptide를 샘플링한다고 볼 수 있다. 하지만 저자들에 따르면, `RFdiffusion3`를 통해 생성한 생성물의 85% 정도 (AT${_2}$의 경우)가 membrane에 들어간 오류였다. 그리고 **Fig 8**에서도 볼 수 있듯, steric clash  (Rosetta PerResidueClashMetric을 이용해서 측정) 비율이 가장 높다. 이에 반해 `BoltzGen`을 통해 나오는 결과들은 natural peptide와 높은 구조적 유사도를 보인다. 심지어 hetero atom (C, H를 제외한 모든 원자)과 hotspot 간의 최단거리도 매우 작게 나온다. 저자들은 backbone으로부터 생성된 서열의 recovery가 다른 method는 0.1을 거의 넘지 않는 것에 비해 `BoltzGen` 결과는 0.25를 보였다는 점을 언급하며, 이를 명확한 암기 (apparent memorization)라고 설명하고 있다.  
<br>


![](https://journals.plos.org/plosone/article/figure/image?size=large&id=10.1371/journal.pone.0355549.g009)
**Fig 9. Structural deviations of repredictions of selected designed peptides with AF2IG, Boltz-2, and RF3, respectively.**  
<br>

마지막으로 저자들은 각 receptor와 각 design method마다 binding pocket 내에 있으면서 clash가 없는 designs 중에서 10개의 서열, 즉 총 90개의 peptide를 random sampling (along **Fig 8**'s y-axis)하였다. 그리고 나서 `AF2IG`, `Boltz-2`, `RF3`를 이용해 50개 seed로 구조를 다시 예측하고, 원래 design과의 DockQ 유사도를 측정하였다 (**Fig 9**). 그림의 왼쪽 분포들이 그 결과인데, 이를 통해 전반적으로 generative design model과 동일 계열의 structure prediction model을 사용할 때 예측력이 가장 좋은 경향을 보였다. 하지만 `high quality`로 분류되는 비율이 낮아, 저자들은 이것이 구조 예측 모델의 문제인지, design model의 inverse folding 문제인지를 확인하기 위해서 각 designed backbone에 대한 서열을 `ProteinMPNN` (temperature 0.05)을 이용하여 다시 sampling하였다. 그 결과 서열의 recovery는 비슷했지만, 전반적으로 DockQ의 `medium quality` 및 `acceptable`의 비율이 증가하였고, 이를 통해 저자들은 `ProteinMPNN`이 구조에 대한 어느정도 optimized 서열을 sampling하기 때문에 이와 같은 결과가 나온 것 같다는 설명을 제시하였다.  
<br>

# 3. Discussion

저자들은 이 논문을 통해서 최근 등장한 structure prediction and generation methods의 가능성과 한계를 GPCR-peptide에 한정하여 평가하였다. 특히 실험 분야에서 *de novo* protein design 분야의 false positive는 알려진 것이지만, 저자들은 실제 알려진 complex를 3가지의 구조 예측 모델을 이용해 예측하고, DockQ와 confidence score와의 상관관계 분석을 통해 왜 그런 false positive가 생기는지를 보였다. 사용자들이 얻어갈 수 있는 것은 <mark>어느정도 구조 예측에서 많은 seed를 이용하면 높은 quality의 예측을 얻을 가능성이 높아지고, 정답과 오답 구조를 pLDDT와 iPAE 등에 기초하여 구별할 수 있다는 점</mark>이다. 다만 여전히 이 solution은 논문에서 확인한 GPCR-peptide에 대한 것이고, general한 score는 얻기 어려웠다.   

저자들은 ipSAE 등이 iPAE보다 더 적은 정보를 사용하므로, PAE matrix의 포함된 공진화 정보들이 어느정도 이상으로는 환원되기 어려워서 iPAE가 더 나은 metric이라는 결과가 나왔을 수 있다고 주장한다. 또한, GPCRs은 전반적인 transmembrane 구조는 보존되어 있지만, receptor는 specificity를 위해 다양하므로, 조금 더 일반적인 protein-protein interaction과는 다른 상황일 수 있다는 점을 언급하고 있다.  

그리고 각 generative method를 비교하면, 각 모델들이 생성하는 구조들은 structurally diverse하고 plausible하지만, 특히 `BoltzGen`의 경우 정확하지만 memorization이 심한 경향이 있다고 언급한다. 또한 여전히 *de novo* design에서 유의미한 후보를 얻기 위해 몇 개 정도의 샘플링이 필요한 지 등은 여전히 미지수이다 (highly target depedent).  

저자들은 한편 본 연구에서 관찰한 한계들은 주로 backbone과 sequence의 동시 생성으로 인해 발생하는 것 같다고 주장한다. 3가지 method로 design한 서열들보다 각 backbone에 대해 `ProteinMPNN`으로 1개의 서열을 뽑았을 때 더 좋았기 때문이다. 그래서 저자들은 small peptide의 경우 `ProteinMPNN`을 사용하는 것이 좀 더 좋은 서열을 얻을 수 있는 방법이라고 제안한다. 동시에 generation method가 side chain 수준의 정밀도는 부족하다고 하면서, 생성한 서열들에 대한 filtering function으로 **hotspot residue contact, known peptide와의 구조적 유사도, Rosetta interface_deltaG 등의 물리학적 평가** 등을 최대한 활용한 후 실험 검증을 하는 것을 추천하고 있다.  
<br>


# What I learned

내가 현재 진행하고 있는 연구와 매우 닮았고, 사실 생성형 AI를 이용하여 protein design을 한다면 누구나 고민해보고 생각할만한 포인트들을 많이 건드린 논문이라서 흥미로웠다. Computation만으로 이루어진 논문이기는 하지만, 결과들을 살펴보면 *de novo* design task에서 참고할만한 점이 꽤 있는 연구라고 생각한다. 특히 design의 성공을 위해서는 결국 universal한 score를 찾아 적용하는 것이 아니라, target의 biological meaning을 면밀히 분석하고, 그에 맞는 filtering or scoring function을 마련하는 것이 훨씬 중요하다는 점을 되새길 수 있었다. 하지만 실험을 하지 않으면 확정할 수 있는 것은 확실히 적다! 
