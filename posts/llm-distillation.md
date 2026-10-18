Big language models (LLMs) are powerful, but they are also heavy. They need strong GPUs, a lot of memory and a lot of money to run. And most of the time, we only need them for one small job, like sorting emails or answering questions about one product.

So here is a simple idea: **what if a small model could learn from a big one and copy its skills?** That idea is called **LLM distillation**.

## What is LLM distillation?

LLM distillation is a way to train a small model by using a big model as its guide.

- The big model is called the **teacher**.
- The small model is called the **student**.

The student does not only read raw data. It also watches how the teacher answers, and tries to answer in the same way. In the end, you get a model that is much smaller and faster, but still good at the task.

![How a teacher model passes knowledge to a smaller student model](assets/img/llm-distillation-diagram.png)

*The teacher and the student both see the same data. The student also learns from the teacher's answers. (Diagram by amitsathvara.netlify.app)*

## Why do we need it?

- **It is faster.** Small models reply quickly, which is great for chatbots and apps.
- **It is cheaper.** You need less hardware and less electricity.
- **It runs in more places.** A small model can run on a laptop or even a phone.
- **It can protect privacy.** When a model runs on the device, the data does not have to leave it.

## How it works, step by step

1. **Pick a strong teacher.** It should already be good at your task.
2. **Collect examples.** These are the questions, texts or inputs your student will see.
3. **Ask the teacher.** Run the teacher on those examples and keep its answers.
4. **Train the student.** Teach it to match the teacher's answers (and the real labels, if you have them).
5. **Test it.** Check the student on your own task, and compare it with the teacher.

## Soft answers: the secret sauce

Imagine a model that looks at a photo and decides between *cat*, *fox* and *dog*.

A normal label only says: **cat**. That's it.

But a teacher model gives a full set of probabilities, called **soft answers**. For example: cat 80%, fox 15%, dog 5%. This tells the student something extra: a fox looks a bit like a cat, and a dog is much less similar. That extra hint is what makes distillation work so well.

![A hard label compared with the soft answer of a teacher model](assets/img/llm-distillation-soft-labels.png)

*Numbers are only an example. (Diagram by amitsathvara.netlify.app)*

There is also a setting called **temperature (T)**. A higher temperature makes the teacher's probabilities softer and more spread out, so the student can see those small hints more clearly.

## The loss function in code

During training, we mix two things: how far the student is from the teacher (soft answers), and how far it is from the real label. Here is a small PyTorch example:

```python
import torch.nn.functional as F

def distillation_loss(student_logits, teacher_logits, labels, T=2.0, alpha=0.5):
    # 1) match the teacher's soft answers
    soft_student = F.log_softmax(student_logits / T, dim=-1)
    soft_teacher = F.softmax(teacher_logits / T, dim=-1)
    kd = F.kl_div(soft_student, soft_teacher, reduction="batchmean") * (T * T)

    # 2) match the real labels
    ce = F.cross_entropy(student_logits, labels)

    # mix both: alpha decides how much we trust the teacher
    return alpha * kd + (1 - alpha) * ce
```

- `T` is the temperature.
- `alpha` is the balance between the teacher and the real labels.
- For text models, you do this at every token position, so flatten the batch and sequence dimensions first.

## Two ways to distill an LLM

**1. Using the teacher's probabilities (logit distillation).** The student learns from the full probability list of the teacher. This needs access to the teacher's internals, so it works best with open models.

**2. Using the teacher's written answers (response distillation).** The teacher writes answers, sometimes with step-by-step reasoning, and you fine-tune the student on this new dataset. This works even when you can only call the teacher through an API. But always read the provider's terms first, because some do not allow using their outputs to train other models.

## A real example: DistilBERT

A well-known example is **DistilBERT**. Its authors reported that it is about 40% smaller than BERT and 60% faster, while keeping about 97% of BERT's language understanding performance. That is a great trade for many apps.

## Other ideas you may hear about

- **Intermediate layer distillation:** the student also copies what happens inside the teacher, not just the final answer.
- **Multi-teacher distillation:** one student learns from more than one teacher.
- **Self-distillation:** a model learns from its own earlier version.

## Distillation vs other ways to shrink a model

| Method | What it does | Makes the model smaller? |
| --- | --- | --- |
| Distillation | A small model learns from a big one | Yes, you get a new smaller model |
| Quantization | Stores the weights with fewer bits | Yes |
| Pruning | Removes weights that matter less | Yes |
| Fine-tuning | Trains a model more for one task | No |

These ideas can also work together. For example, you can distill a model first and then quantize it.

## Things to watch out for

- **Some knowledge is lost.** A small student cannot copy everything, especially hard reasoning.
- **The student copies the teacher's mistakes.** A weak teacher or poor data means a weak student.
- **It needs experiments.** Values like `T` and `alpha` change the result, so try a few.
- **Check the rules.** Look at the licence or terms of the teacher model before you use its outputs.
- **Test on your own task.** Compare accuracy, speed, size and cost, not just one number.

## Try it yourself

A good first project: take a text classifier (for example, a sentiment model) as the teacher, train a much smaller student with the loss above, and then compare accuracy and speed. It is a nice small project to show on a portfolio.

## Key takeaways

- Distillation teaches a small **student** model using a big **teacher** model.
- Soft answers carry extra hints, so the student learns more than from labels alone.
- You get a model that is faster, cheaper and easier to deploy, with a small drop in quality.
- Always test the student on your own task.

## Further reading

- [LLM Distillation Explained: Applications, Implementation & More](https://www.datacamp.com/blog/distillation-llm) on DataCamp
- [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531) (Hinton et al., 2015), the classic paper
- [DistilBERT, a distilled version of BERT](https://arxiv.org/abs/1910.01108) (Sanh et al., 2019)
- [Knowledge Distillation: A Survey](https://arxiv.org/abs/2006.05525), a detailed overview
