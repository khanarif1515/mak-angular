import { Component, inject } from '@angular/core';
import { SeoS, VarS } from '../../shared/services';
import { ActivatedRoute } from '@angular/router';
import { ITransaction } from '../../shared/models/transaction.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'app-transactions',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
  readonly vars = inject(VarS);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoS);
  private readonly userS = inject(UserService);

  username: string = '';
  transactions: ITransaction[] = [];

  ngOnInit() {
    this.username = this.route.snapshot.params['username'];
    this.readyPage();
    this.loadTransactions();
  }

  async readyPage() {
    await this.userS.getMaskedUserDetails(this.username);
    this.seo.setPageTitle();
  }

  loadTransactions() {
    // this.userS.getMaskedUserDetails(this.username).subscribe({
    //   next: (res: any) => {
    //     this.transactions = res?.data?.transactions || [];
    //   },
    //   error: (err: any) => {
    //     console.error('Error fetching transactions:', err);
    //   }
    // });
  }

}
