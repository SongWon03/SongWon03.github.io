---

title: "Amino Acid Substitution Matrix: BLOSUM62"

date: "2025-11-08"

thumbnail: "/assets/img/thumbnail/bioinformatics-001.png"

---

# Introduction

두 개 혹은 그 이상의 amino acid sequence의 유사도를 비교할 때, 우리는 sequence alignment를 한다. Aligned sequences의 유사도를 numerical하게 표현하는 가장 쉬운 방법은 residue가 동일하면 1, 아니면 0으로 두고 그 합이나 평균을 구하는 방법이다. 하지만, 현재 대부분의 sequence alignment program은 BLOSUM62 라는 score matrix를 이용한다. 따라서 BLOSUM62 substitution matrix가 어떤 방법으로 도출된 것이고, 언제 사용하면 좋을 지에 대해서 정리하고자 한다. 

## Reference

From main texts and figures in 
- S. Henikoff, & J.G. Henikoff, Amino acid substitution matrices from protein blocks., Proc. Natl. Acad. Sci. U.S.A. 89 (22) 10915-10919, https://doi.org/10.1073/pnas.89.22.10915 (1992).
- Eddy, S. Where did the BLOSUM62 alignment score matrix come from?. Nat Biotechnol 22, 1035–1036 (2004). https://doi.org/10.1038/nbt0804-1035


# Meaning of Alignment Scores (log-odds scores)

Alignment를 통해서 우리가 알고 싶은 것은 sequence들이 homologous (evolutionary related) 인지 아닌지를 확인하는 것이다. 즉, 단순히 matching +1, mismatch -1 과 같은 식의 score 보다는 진화적 관계를 반영할 수 있는 score가 더 좋다. Homologous or not 이라는 두 가지 가설을 비교할 때, 하나의 좋은 score는 log-odds score이다. 

- **likelihood**: $P(x|\theta)$, 특정한 확률 분포의 매개변수가 주어졌을 때, 그 매개변수로 부터 관측값인 x들이 나올 확률을 의미한다. 예를 들어 $\mu=0, \sigma=1$이라는 정규분포의 평균과 표준편차가 주어졌다고 하면, x=0일 확률은 $Normal(x=0|\mu = 0, \sigma = 1)$이 된다.   
- **odds-ratio**: $\frac{P(\theta)}{P(\theta^C)}$로 가설이 참일 확률과 아닐 확률의 비율로 나타나며, 데이터를 관측한 후의 odds ratio인 posterior odds는 bayes theorem에 의해서 prior odds와 likelihood의 곱으로 나타낼 수 있다. 즉, $\frac{P(\theta|x)}{P(\theta^C|x)} = \frac{P(\theta)}{P(\theta^C)} \frac{P(x|\theta)}{P(x|\theta^C)}$이다. 참고로 alignment score에서 고려하고 있는 odds ratio는 prior odds가 1인 경우로, 어느 가설이 참인지에 대한 선험적인 지식이 없는 경우이다. 

위의 통계적 배경지식을 참고하여, 결국 log-odds score는 *the logarithm of the ratio of the likelihoods of two hypothesis*가 된다. 만약 우리가 각각의 aligned residue pair가 다른 residue들에 대해 statistically independent 하다고 가정하면, 전체 alignment score는 각 aligned pair의 log-odds score의 합으로 생각할 수 있다. 

각 residue에 올 수 있는 amino acid의 종류는 20가지이므로, pair의 조합을 통해서 20 x 20 score matrix를 형성할 수 있다. 이때 구체적으로 align하는 residue a와 residue b의 score는 아래의 식과 같이 계산한다. 

$$s(a,b) = \frac{1}{\lambda} \log \frac{p_{ab}}{f_a f_b}$$

- $p_{ab}$: likelihood of the hypothesis we want to test (two residues are correlated because they are homologous). 즉, target frequency로 homologous sequence alignment를 했을 때 residue a와 b가 aligned 된 것을 관측할 것이라고 우리가 기대하는 확률
- $f_a f_b$: likelihood of a null hypothesis (two residues are uncorrelated and occuring independently). 즉, background frequency로 어떤 protein sequence 내에서든 평균적으로 amino acids a와 b를 관측할 것이라고 기대하는 확률
- $\lambda$: scaling factor; term들이 너무 가깝거나 멀 때 우리가 구별하기 좋은 정수 값으로 반올림 해주기 위한 hyperparamter.

만약 homologous sequence 내에서 a와 b가 aligned 된 것을 발견하는 일이 우연 (by chance)에 의한 것보다 더 자주 일어난다고 기대한다면, odds ratio는 1보다 크기 때문에 score가 양수가 된다. 즉, *positive score는 conservative substitutions*을 의미하고, *negative score는 nonconservative substitution*을 의미한다. 하지만 하나의 중요한 포인트는 다음과 같다. 

>**"This definition of 'conservative substitution' in a score matrix is purely statistical. It has nothing to do with amino acid structure or biochemistry."**


## Details in BLOSUM62 Substitution Matrix

$$s(a,b) = \frac{1}{\lambda} \log \frac{p_{ab}}{f_a f_b}$$

여기서는 위의 score function을 통해 BLOSUM62에서 계산된 결과들의 예시와 비직관적인 부분들에 대한 detail을 정리할 것이다. 

1) tryptophan (W/W) pairs score = +11, leucine (L/L) pairs score = +4. 
    - 왜 모든 동일 residue pairs가 같은 score를 가지지 않을까?
    - 더 희귀한 amino acid 일수록, 우연에 의해 aligned 되는 것이 더 놀랄만하기 때문에!
    - 실제로 BLOSUM62를 학습시킨 homologous alignment data에는 $p_{LL} = 0.0371, p_{WW} = 0.0065$로 L/L pair의 비율이 더 높지만, tryptophan 자체가 더 희귀한 amino acid이기 때문에 ($f_L = 0.099, f_W = 0.013$) BLOSUM 62의 기본 $\lambda = 0.347$로 계산하고 이를 반올림 하면 각각 +11과 +4의 score를 얻을 수 있다. 
2) apparently nonconservative alignment of a positively charged glutamic acid = +1, but more innocuous alignment of alanine to leucine get penalized = -1.
    - A/L pair의 비율이 K/E pair에 비해 homologous alignments에서 더 흔하지만 ($p_{AL} = 0.0044, p_{KE} = 0.0041$), A와 L이 더 흔한 amino acid이기 때문에 ($p_A = 0.074, p_L = 0.099, p_K = 0.058, p_E = 0.054$) 결과적으로 -1과 +1의 score로 계산된다. 


# Where did *target frequencies* come from?

Target frequency ($p_{ab}$)를 계산하는 방식에 따라 우리가 얻게 되는 substitution matrix의 종류가 달라진다. 그 이유를 한 번 살펴보겠다.  

앞서 정리했듯 target frequency는 homologous alignment에서 a, b가 aligned 된 것을 볼 것이라고 우리가 기대하는 확률이다. 즉, 우리가 alignment를 통해서 보고자 하는 상황과 비슷한, 많은 알려진 pairwise alignments들의 데이터를 이용하여 그로부터 각각의 residue pair가 발생하는 비율을 계산하는 것이 가장 기본적인 아이디어가 된다. 

BLOSUM62는 general purpose matrix이지만, 실제로 sequence or species specific source of information을 사용하기 어려운 방법이다. 우리가 aligning하는 두 sequence에 대해 많은 정보를 가지고 있다면, 우리는 target frequency를 좀 더 잘 추정할 수 있다 (e.g. two integral membrane proteins, them biased toward hydrophobicity). 즉, sequence alignment database를 나누고, 특정한 organism이나 특정한 종류의 sequence에 특화된 new score matrix를 추정하는 방법은 무궁무진하다. 

하나의 중요한 정보는 *evolutionary distance*인데, target frequency가 두 서열 간의 진화적 거리에 매우 의존적이기 때문이다. 만약 최근에 분화된 서열들이라면 target frequency는 W/W 같이 동일한 residue에서 peak를 보이고, 더 divergent한 관계일수록 flat한 분포를 가져야 할 것이다. 정리하면, 현대의 모든 amino acid score matrix들은 신뢰도가 높은 alignment data로부터 관측된 frequency를 사용하지만, 특정한 divergence의 정도에 따라 적절한 절차를 거쳐 만들어 진다는 것이다. 

만약 특정한 두 서열의 alignment score를 보고 싶다면, 그들의 evolutionary distance가 얼마나 되는 지를 생각한 후에 아래의 amino acid substitution matrix 중 적절한 하나를 적용해볼 수 있을 것이다. 

- BLOSUM62 matrix: from big database of trusted alignments, only counted pairwise sequence alignments related 62% identity or less than threshold. 
- BLOSUM80 matrix: gave more highly conserved target frequencies
- BLOSUM45 matrix: gave more divergent matrix
- These BLOSUM matrices are empirically performed very good, and *de facto* standard...

아래는 BLOSUM62 matrix와 PAM160 이라는 matrix의 차이를 보여준다.  
![BLOSUM62](/assets/img/thumbnail/bioinformatics-001.png)





